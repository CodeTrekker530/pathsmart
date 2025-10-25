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

        self.reset_state()  # Add this to initialize state

    def reset_state(self):
        """Reset all pathfinding state"""
        self.visited_stalls = set()
        self.excluded_end_nodes = set()

    def get_neighbors(self, node_id):
        """Get all connected nodes and their distances"""
        return self.connections.get(str(node_id), {})

    def get_stall_from_pathnode(self, node_id):
        """Find which stall a pathNode belongs to"""
        for stall_id, stall_data in self.save_data['stalls'].items():
            if node_id in stall_data.get('pathNode', []):
                return stall_id
        return None

    def get_path_nodes_for_item(self, item_id, item_type='Product', exclude_nodes=None):
        """Get path nodes for a product or stall, excluding certain nodes
        Args:
            item_id: The ID of the product or stall
            item_type: Either 'Product' or 'Stall'
            exclude_nodes: Set of nodes to exclude
        """
        path_nodes = []
        item_id = int(item_id)
        exclude_nodes = exclude_nodes or set()
        
        if item_type == 'Product':
            for stall_id, stall_data in self.save_data['stalls'].items():
                if 'products' in stall_data and item_id in stall_data['products']:
                    stall_nodes = stall_data.get('pathNode', [])
                    path_nodes.extend([node for node in stall_nodes if node not in exclude_nodes])
        else:
            stall = self.save_data['stalls'].get(str(item_id))
            if stall:
                stall_nodes = stall.get('pathNode', [])
                path_nodes.extend([node for node in stall_nodes if node not in exclude_nodes])

        return list(set(path_nodes))

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
        if not possible_end_nodes:
            return None
            
        min_cost = float('inf')
        best_node = None
        
        for end_node in possible_end_nodes:
            path = self.find_path(start_id, end_node)
            if path:
                cost = 0
                for i in range(len(path) - 1):
                    cost += float(self.get_neighbors(path[i])[str(path[i + 1])])
                if cost < min_cost:
                    min_cost = cost
                    best_node = end_node
    
        return best_node

    def find_optimal_route(self, start_id, item_list):
        """Find optimal route through all items in shopping list"""
        remaining_items = [item for item in item_list if not item.get('checked', False)]
        if not remaining_items:
            return []

        current_pos = start_id
        route_order = []
        available_nodes = set()

        # Collect all possible destination nodes
        for item in remaining_items:
            if item['type'] == 'Product':
                # Get all stalls selling this product
                product_id = int(item['id'].replace('p', ''))
                for stall in self.save_data['stalls'].values():
                    if product_id in stall['products']:
                        available_nodes.update(stall['pathNode'])
            else:
                # Direct stall location
                stall_id = int(item['id'].replace('s', ''))
                stall = self.save_data['stalls'].get(str(stall_id))
                if stall:
                    available_nodes.update(stall['pathNode'])

        # Find optimal ordering
        while available_nodes:
            min_dist = float('inf')
            next_node = None
            
            for node in available_nodes:
                path = self.find_path(current_pos, node)
                if path:
                    dist = len(path)
                    if dist < min_dist:
                        min_dist = dist
                        next_node = node
            
            if next_node:
                route_order.append(next_node)
                current_pos = next_node
                available_nodes.remove(next_node)
            else:
                break

        return route_order

    def optimize_shopping_route(self, start_id, shopping_list):
        """Find optimal route through shopping list items"""
        # Initialize variables
        unvisited_items = shopping_list.copy()
        current_pos = start_id
        optimal_route = []
        
        while unvisited_items:
            min_cost = float('inf')
            next_item = None
            best_path = None
            
            # Try each remaining item
            for item in unvisited_items:
                item_id = int(item['id'].replace('p' if item['type'] == 'Product' else 's', ''))
                end_nodes = self.get_path_nodes_for_item(item_id, item['type'])
                    
                # Find closest node for this item
                for end_node in end_nodes:
                    path = self.find_path(current_pos, end_node)
                    if path:
                        cost = self.calculate_path_cost(path)
                        if cost < min_cost:
                            min_cost = cost
                            next_item = item
                            best_path = path
        
            if next_item:
                optimal_route.append({
                    'item': next_item,
                    'path': best_path
                })
                current_pos = best_path[-1]
                unvisited_items.remove(next_item)
            else:
                break
    
        return optimal_route

    def get_next_path_node(self, start_id, current_stall_id, possible_end_nodes, visited_nodes):
        """Find the next best pathNode, excluding nodes from current stall and already visited nodes
        Args:
            start_id: Current position node ID
            current_stall_id: ID of the current stall to exclude
            possible_end_nodes: List of all possible destination nodes
            visited_nodes: List of nodes that have already been visited
        Returns:
            Next best pathNode ID, or None if no more available
        """
        # Get current stall's pathNodes to exclude them
        current_stall = self.save_data['stalls'].get(str(current_stall_id))
        excluded_nodes = set(current_stall.get('pathNode', []) if current_stall else [])
        
        # Add visited nodes to excluded nodes
        excluded_nodes.update(visited_nodes)
        
        # Filter out excluded nodes
        available_nodes = [node for node in possible_end_nodes if node not in excluded_nodes]
        
        if not available_nodes:
            return None
            
        # Find the closest node from the remaining available nodes
        return self.find_closest_path_node(start_id, available_nodes)

pathfinder = PathFinder()

@app.route('/findpath', methods=['POST'])
def find_path():
    data = request.json
    
    # Handle reset request first
    if data.get('reset'):
        pathfinder.reset_state()
        print("\n=== Pathfinding Reset ===")
        print("All states cleared")
        return jsonify({'status': 'reset successful'}), 200

    data = request.json
    start_id = data.get('start')
    shopping_list = data.get('shopping_list', [])
    current_index = data.get('current_index', 0)
    reset = data.get('reset', False)

    if reset:
        pathfinder.excluded_end_nodes.clear()
        return jsonify({'status': 'reset successful'}), 200

    print("\n=== Path Finding ===")
    print(f"Start node: {start_id}")
    print(f"Currently excluded nodes: {pathfinder.excluded_end_nodes}")

    if not start_id:
        return jsonify({'error': 'Missing start node'}), 400

    if shopping_list and len(shopping_list) > 0:
        current_item = shopping_list[current_index]
        
        if current_item['type'] == 'Product':
            item_id = int(current_item['id'].replace('p', ''))
            
            # First get all stalls that sell this product
            valid_stalls = {}
            for stall_id, stall_data in pathfinder.save_data['stalls'].items():
                if 'products' in stall_data and item_id in stall_data['products']:
                    valid_stalls[stall_id] = stall_data

            # Get possible end nodes only from valid stalls
            possible_end_nodes = []
            for stall_data in valid_stalls.values():
                possible_end_nodes.extend(stall_data.get('pathNode', []))
            
            # Filter out excluded end nodes
            available_end_nodes = [node for node in possible_end_nodes 
                                 if node not in pathfinder.excluded_end_nodes]
            
            if not available_end_nodes:
                return jsonify({'error': 'No more available nodes'}), 404

            # Find closest available end node
            end_id = pathfinder.find_closest_path_node(start_id, available_end_nodes)

            if not end_id:
                return jsonify({'error': 'No reachable path node found'}), 404

            # Find path
            path = pathfinder.find_path(start_id, end_id)
            
            print("\n=== Generated Path ===")
            print(f"Path sequence: {' -> '.join(map(str, path))}")
            
            # Find which valid stall this end node belongs to
            destination_stall = None
            for stall_id, stall_data in valid_stalls.items():
                if end_id in stall_data.get('pathNode', []):
                    destination_stall = stall_id
                    stall_pathnodes = stall_data.get('pathNode', [])
                    print(f"Destination stall {stall_id} pathNodes: {stall_pathnodes}")
                    pathfinder.excluded_end_nodes.update(stall_pathnodes)
                    break

            print(f"Updated excluded nodes: {pathfinder.excluded_end_nodes}\n")

            return jsonify({
                'path': path,
                'current_stall': destination_stall
            })

    return jsonify({'error': 'Invalid request'}), 400

if __name__ == '__main__':
    print("PathFinder initialized. Loading data files...")
    app.run(debug=True)