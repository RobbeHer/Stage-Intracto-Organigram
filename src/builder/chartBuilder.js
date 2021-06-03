class ChartBuilder {
    getChildren(parent) {
        let children = this.data.filter(data => data.pid === parent.id);
        if (!children.length) {
            return { id: parent.id, title: parent.type, name: `${parent.id.toString(16)}. ${parent.name}` }
        }
        return { id: parent.id, title: parent.type, name: `${parent.id.toString(16)}. ${parent.name}`, children: children.map(child => this.getChildren(child)) };
    }

    build(data) {
        this.data = data;
        let chart = [];
        let firstLayers = data.filter(data => data.pid === 0);

        firstLayers.forEach(parent => {
            chart.push(this.getChildren(parent));
        });

        return { id: 0, name: "Pieter Janssens", title: "CEO", children: chart };
    }
}

export default ChartBuilder;