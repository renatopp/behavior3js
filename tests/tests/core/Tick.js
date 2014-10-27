// store open children
// call debug

suite('Core: Tick', function() {
    test('Initialization', function() {
        var tick = new b3.Tick();
        
        assert.isDefined(tick.tree);
        assert.isDefined(tick.openNodes);
        assert.isDefined(tick.nodeCount);
        assert.isDefined(tick.debug);
        assert.isDefined(tick.target);
        assert.isDefined(tick.blackboard);

        assert.equal(tick.nodeCount, 0);
        assert.equal(tick.openNodes.length, 0);
    });

    test('Updating tick info on enter', function() {
        var tick = new b3.Tick();
        var node = {'id': 'node1'}
        
        tick.enterNode(node);
        assert.equal(tick.nodeCount, 1);
        assert.equal(tick.openNodes.length, 1);
        assert.strictEqual(tick.openNodes[0], node);
    });

    test('Updating tick info on close', function() {
        var tick = new b3.Tick();
        var node = {'id': 'node1'}

        tick.nodeCount = 1;
        tick.openNodes = [node];
        
        tick.closeNode(node);
        assert.equal(tick.nodeCount, 1);
        assert.equal(tick.openNodes.length, 0);
    });

    // test('Callbacks calling debug', function() {
        
    // })
});