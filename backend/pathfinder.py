from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import heapq
import math
import os

app = Flask(__name__)
CORS(app)

class PathFinder:
    def __init__(self):
        # Load all required JSON files
        current_dir = os.path.dirname(os.path.abspath(__file__))
        app_dir = os.path.join(current_dir, '..', 'app', 'utils')
        
        # Load nodes data
        with open(os.path.join(app_dir, 'f1nodes.json')) as f:
            self.nodes = json.load(f)['nodes']
            
        # Load connections data
        with open(os.path.join(app_dir, 'connections.json')) as f:
            self.connections = json.load(f)['connections']
            
        # Load stalls and products data
        with open(os.path.join(app_dir, 'saveData.json')) as f:
            self.save_data = json.load(f)

    def get_neighbors(self, node_id):
        """Get all connected nodes and their distances"""
        return self.connections.get(str(node_id), {})

    def get_path_nodes_for_product(self, product_id):
        """Get path nodes for all stalls selling this product"""
        path_nodes = []
        product_id = int(product_id)
        
        print(f"Looking for path nodes for product {product_id}")
        # Find all stalls that sell this product
        for stall_id, stall_data in self.save_data['stalls'].items():
            if product_id in stall_data['products']:
                print(f"Found product in stall {stall_id} with path nodes {stall_data['pathNode']}")
                # Make sure to use the correct stall's path nodes
                if isinstance(stall_data['pathNode'], list):
                    path_nodes.extend(stall_data['pathNode'])
                else:
                    path_nodes.append(stall_data['pathNode'])
        
        print(f"All possible path nodes: {path_nodes}")
        return path_nodes

    def find_path(self, start_id, end_id):
        """A* pathfinding implementation"""
        frontier = [(0, start_id)]
        came_from = {start_id: None}
        cost_so_far = {start_id: 0}
        
        while frontier:
            current_cost, current = heapq.heappop(frontier)
            
            if current == end_id:
                break
                
            # Check all neighbors
            for next_str, distance in self.get_neighbors(current).items():
                next_node = int(next_str)
                new_cost = cost_so_far[current] + float(distance)
                
                if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                    cost_so_far[next_node] = new_cost
                    # Use actual distance for priority
                    priority = new_cost
                    heapq.heappush(frontier, (priority, next_node))
                    came_from[next_node] = current

        # Reconstruct path
        current = end_id
        path = []
        
        while current is not None:
            path.append(current)
            current = came_from.get(current)
            
        path.reverse()
        return path if path[0] == start_id else []

    def find_closest_path_node(self, start_id, possible_end_nodes):
        """Find the closest accessible path node from the list"""
        if not possible_end_nodes:
            return None
            
        min_cost = float('inf')
        best_node = None
        
        # Debug print
        print(f"Finding closest path node from {possible_end_nodes} to start node {start_id}")
        
        for end_node in possible_end_nodes:
            # Try to find a path to this end node
            path = self.find_path(start_id, end_node)
            if path:  # If path exists
                # Calculate total path cost
                cost = 0
                for i in range(len(path) - 1):
                    cost += float(self.get_neighbors(path[i])[str(path[i + 1])])
                print(f"Path to node {end_node} costs {cost}")
                if cost < min_cost:
                    min_cost = cost
                    best_node = end_node
    
        print(f"Selected end node: {best_node}")
        return best_node

pathfinder = PathFinder()

@app.route('/findpath', methods=['POST'])
def find_path():
    data = request.json
    start_id = data.get('start')
    product_id = data.get('product_id')
    
    if not start_id or not product_id:
        return jsonify({'error': 'Missing start node or product ID'}), 400
        
    # Get all possible path nodes for the product
    possible_end_nodes = pathfinder.get_path_nodes_for_product(product_id)
    
    if not possible_end_nodes:
        return jsonify({'error': 'No path nodes found for this product'}), 404
        
    # Find the closest accessible path node
    end_id = pathfinder.find_closest_path_node(start_id, possible_end_nodes)
    
    if not end_id:
        return jsonify({'error': 'No reachable path node found'}), 404
        
    # Find the path to the closest node
    path = pathfinder.find_path(start_id, end_id)
    
    return jsonify({'path': path})

if __name__ == '__main__':
    print("PathFinder initialized. Loading data files...")
    app.run(debug=True)