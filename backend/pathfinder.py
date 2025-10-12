from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import heapq
import math

app = Flask(__name__)
CORS(app)

# Add this variable at the top level for easy configuration
TARGET_END_NODE = 82  # Change this value to test different end nodes

class PathFinder:
    def __init__(self):
        # Load nodes and connections
        with open('../app/utils/f1nodes.json') as f:
            self.nodes = json.load(f)['nodes']
        with open('../app/utils/connections.json') as f:
            self.connections = json.load(f)['connections']

    def heuristic(self, node1_id, node2_id):
        """Calculate straight-line distance between nodes"""
        node1 = self.nodes[str(node1_id)]
        node2 = self.nodes[str(node2_id)]
        return math.sqrt((node1['x'] - node2['x'])**2 + (node1['y'] - node2['y'])**2)

    def get_neighbors(self, node_id):
        """Get connected nodes and their distances"""
        return self.connections.get(str(node_id), {})

    def find_path(self, start_id, end_id):
        """A* pathfinding implementation"""
        frontier = [(0, start_id)]
        came_from = {start_id: None}
        cost_so_far = {start_id: 0}

        while frontier:
            current_cost, current_id = heapq.heappop(frontier)

            if current_id == end_id:
                break

            for next_id, distance in self.get_neighbors(current_id).items():
                next_id = int(next_id)
                new_cost = cost_so_far[current_id] + distance

                if next_id not in cost_so_far or new_cost < cost_so_far[next_id]:
                    cost_so_far[next_id] = new_cost
                    priority = new_cost + self.heuristic(next_id, end_id)
                    heapq.heappush(frontier, (priority, next_id))
                    came_from[next_id] = current_id

        # Reconstruct path
        path = []
        current_id = end_id
        while current_id is not None:
            path.append(current_id)
            current_id = came_from.get(current_id)

        return path[::-1] if path[-1] == start_id else []

pathfinder = PathFinder()

@app.route('/findpath', methods=['POST'])
def find_path():
    data = request.json
    start_id = data.get('start')
    # Use the configured end node instead of getting it from request
    end_id = TARGET_END_NODE
    
    if not start_id:
        return jsonify({'error': 'Missing start node'}), 400
        
    path = pathfinder.find_path(start_id, end_id)
    return jsonify({'path': path})

if __name__ == '__main__':
    print(f"Pathfinder running with target end node: {TARGET_END_NODE}")
    app.run(debug=True)