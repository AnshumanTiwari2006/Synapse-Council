export const formatVRT = (vrt) => {
    if (!vrt || !vrt.nodes) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    // Layout configuration
    const startX = 250;
    const startY = 50;
    const gapY = 150;
    const gapX = 200;

    // Group nodes by type/stage for layout
    const stages = {
        initial_answer: [],
        critique: [],
        ranking: [],
        synthesis: []
    };

    vrt.nodes.forEach(node => {
        if (stages[node.type]) {
            stages[node.type].push(node);
        } else {
            // Fallback for unknown types
            stages.initial_answer.push(node);
        }
    });

    // Helper to add node
    const addNode = (n, x, y) => {
        nodes.push({
            id: n.id,
            type: 'default', // Custom types can be added later
            data: { label: `${n.role.toUpperCase()}\n${n.model.split('/')[1]}` },
            position: { x, y },
            style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                fontSize: '12px',
                width: 150,
                textAlign: 'center'
            }
        });
    };

    // Layout Stage 1: Initial Answers (Horizontal row)
    stages.initial_answer.forEach((n, i) => {
        addNode(n, i * gapX, startY);
    });

    // Layout Stage 1.5: Critiques (Horizontal row below)
    stages.critique.forEach((n, i) => {
        addNode(n, i * gapX, startY + gapY);
    });

    // Layout Stage 2: Rankings (Centered below)
    stages.ranking.forEach((n, i) => {
        const offset = (stages.initial_answer.length * gapX) / 2 - (stages.ranking.length * gapX) / 2;
        addNode(n, offset + i * gapX, startY + gapY * 2);
    });

    // Layout Stage 3: Synthesis (Centered below)
    stages.synthesis.forEach((n, i) => {
        const centerX = (stages.initial_answer.length * gapX) / 2;
        addNode(n, centerX, startY + gapY * 3);
    });

    // Edges
    if (vrt.edges) {
        vrt.edges.forEach((e, i) => {
            edges.push({
                id: `e${i}`,
                source: e.from,
                target: e.to,
                animated: true,
                style: { stroke: '#4b5563' },
                label: e.relation
            });
        });
    }

    return { nodes, edges };
};
