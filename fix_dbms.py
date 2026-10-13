import json

# Read the file
with open('app/data/answers/database-management-systems.json','r',encoding='utf-8') as f:
    lines = f.readlines()

# Line 729 (0-indexed: 728) has the problematic explanation
# Replace it with a clean JSON-escaped version
clean_explanation = "Order 4 means a node has at most 4 children, hence at most 3 keys, and every non-root node must retain at least ceil(4/2) - 1 = 1 key. A node splits when a fourth key would have to be stored in it; the middle key is promoted to the parent and the node becomes two nodes. Exhaustively simulating all 8! = 40320 insertion orders and validating that each result is a legal order-4 B-tree gives 2 splits for 36864 orders and 3 splits for 3456 orders, so the maximum is 3. A worst case order is 1, 2, 7, 8, 5, 6, 3, 4: inserting 8 overflows the root (split 1, new root 7 over children {1,2} and {8}); inserting 6 overflows {1,2} (split 2, root {5,7} over {1,2}, {6}, {8}); inserting 4 overflows {1,2} again (split 3, root {3,5,7} over {1,2}, {4}, {6}, {8}). More than 3 splits is impossible: a root split adds two nodes and every other split adds one, so the tree can never exceed 5 nodes here (root with 3 keys plus four leaves), and 5 nodes from a single starting node requires exactly one root split plus two child splits, i.e. 3 splits. Reaching a third level would need at least 7 nodes and 7 keys (root 1 key, two internal nodes, four leaves), which 8 insertions under this split rule cannot produce.\n\nWhy A is correct: The maximum number of node-splitting operations over all insertion orders of 8 keys into an order-4 B-tree is 3.\n\nWhy the others are wrong:\n- B: 4 splits would require 6 nodes, and no insertion order of 8 keys into an order-4 B-tree builds 6 nodes.\n- C: 5 splits is not reachable; the root can split only once and only two further child splits are possible.\n- D: 6 is not reachable for the same node-count reason."

# Use json.dumps to properly escape
escaped = json.dumps(clean_explanation)
# Remove the surrounding quotes from dumps
escaped = escaped[1:-1]

lines[728] = f'      "explanation": "{escaped}",\n'

with open('app/data/answers/database-management-systems.json','w',encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed line 729')