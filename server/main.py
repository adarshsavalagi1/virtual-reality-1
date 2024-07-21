import cv2
import numpy as np
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Set the camera resolution to 640x480
frame_width = 640
frame_height = 480
cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

# Grid size
rows, cols = 10, 10
cell_width = frame_width // cols
cell_height = frame_height // rows

# Coordinate mappings
coordinate_map = {
    ((0, 0), (1, 0), (0, 1), (1, 1)): "five_five",
    ((0, 2), (1, 2), (0, 3), (1, 3)): "five_four",
    ((0, 4), (1, 4), (0, 5), (1, 5)): "five_three",
    ((0, 6), (1, 6), (0, 7), (1, 7)): "five_two",
    ((0, 8), (1, 8), (0, 9), (1, 9)): "five_one",
    ((2, 8), (3, 8), (2, 9), (3, 9)): "four_one",
    ((4, 8), (4, 9), (5, 8), (5, 9)): "three_one",
    ((6, 8), (6, 9), (7, 8), (7, 9)): "two_one",
    ((8, 8), (9, 8), (8, 9), (9, 9)): "one_one",
    ((8, 6), (8, 7), (9, 6), (9, 7)): "one_two",
    ((8, 4), (8, 5), (9, 4), (9, 5)): "one_three",
    ((8, 2), (8, 3), (9, 2), (9, 3)): "one_four",
    ((8, 0), (8, 1), (9, 0), (9, 1)): "one_five",
    ((6, 0), (7, 0), (7, 1), (6, 1)): "two_five",
    ((4, 0), (5, 0), (5, 1), (4, 1)): "three_five",
    ((2, 0), (3, 0), (3, 1), (4, 1)): "four_five",
}


# coordinate_map = {
#     ((0, 0), (1, 0), (0, 1), (1, 1)): 8,
#     ((0, 2), (1, 2), (0, 3), (1, 3)): 9,
#     ((0, 4), (1, 4), (0, 5), (1, 5)): 10,
#     ((0, 6), (1, 6), (0, 7), (1, 7)): 11,
#     ((0, 8), (1, 8), (0, 9), (1, 9)): 12,
#     ((2, 8), (3, 8), (2, 9), (3, 9)): 13,
#     ((4, 8), (4, 9), (5, 8), (5, 9)): 14,
#     ((6, 8), (6, 9), (7, 8), (7, 9)):15,
#     ((8, 8), (9, 8), (8, 9), (9, 9)): 0,
#     ((8, 6), (8, 7), (9, 6), (9, 7)): 1,
#     ((8, 4), (8, 5), (9, 4), (9, 5)): 2,
#     ((8, 2), (8, 3), (9, 2), (9, 3)): 3,
#     ((8, 0), (8, 1), (9, 0), (9, 1)): 4,
#     ((6, 0), (7, 0), (7, 1), (6, 1)): 5,
#     ((4, 0), (5, 0), (5, 1), (4, 1)): 6,
#     ((2, 0), (3, 0), (3, 1), (4, 1)): 7,
# }

def draw_grid(frame, rows, cols, cell_width, cell_height):
    h, w, _ = frame.shape
    for i in range(0, w, cell_width):
        cv2.line(frame, (i, 0), (i, h), (255, 255, 255), 1)
    for i in range(0, h, cell_height):
        cv2.line(frame, (0, i), (w, i), (255, 255, 255), 1)

def get_grid_position(x, y, cell_width, cell_height):
    return (x // cell_width, y // cell_height)

def check_coordinates(grid_x, grid_y):
    for coords, image_name in coordinate_map.items():
        if (grid_x, grid_y) in coords:
            return image_name
    return 'three_three'
# FastAPI app initialization
app = FastAPI()

# CORS middleware
origins = [
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket endpoint for broadcasting coordinates
@app.websocket("/ws/coordinates")
async def websocket_endpoint_coordinates(websocket: WebSocket):
    await websocket.accept()
    
    prev_grid_x, prev_grid_y = -1, -1  # Initialize with invalid grid positions
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        draw_grid(frame, rows, cols, cell_width, cell_height)
        
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        lower_red1 = np.array([0, 120, 70])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 120, 70])
        upper_red2 = np.array([180, 255, 255])
        
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask = mask1 + mask2
        
        contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            center_x, center_y = x + w // 2, y + h // 2
            grid_x, grid_y = get_grid_position(center_x, center_y, cell_width, cell_height)
            
            if grid_x != prev_grid_x or grid_y != prev_grid_y:
                image_name = check_coordinates(grid_x, grid_y)
                print(f'Calling image {image_name}')
                
                await websocket.send_json({"grid_x": grid_x, "grid_y": grid_y, "image_name": image_name})
                
                prev_grid_x, prev_grid_y = grid_x, grid_y  # Update previous coordinates
        
        await asyncio.sleep(0.1)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
