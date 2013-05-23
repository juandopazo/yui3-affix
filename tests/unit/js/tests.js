YUI.add('affix-tests', function(Y) {

    var Assert = Y.Test.Assert,
        win = Y.config.win;

    var suite = new Y.Test.Suite('affix');

    suite.add(new Y.Test.Case({
        name: 'Affix Tests',

        'test vertical scrolling': function () {
            win.scrollTo(0, 0);
            
            var test = this,
                node = Y.one('#affix').plug(Y.Plugin.Affix),
                offset = node.getData('offset-top');

            Assert.areEqual('static', node.getComputedStyle('position'), 'before vertical scrolling position should be static');

            setTimeout(function () {
                win.scrollTo(0, 350);
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('fixed', node.getComputedStyle('position'), 'after vertical scrolling position should be fixed');
                        var top = node.getComputedStyle('top');
                        Assert.areEqual(offset, top.substr(0, top.length - 2), 'after scrolling vertical position should equal offset');
                        node.unplug(Y.Plugin.Affix);
                    });
                }, 10);
            }, 20);

            test.wait();
        },

        'test horizontal scrolling': function () {
            win.scrollTo(0, 0);
            
            var test = this,
                offset = 50,
                node = Y.one('#affix').plug(Y.Plugin.Affix, {
                    offset: {
                        left: offset
                    }
                });

            Assert.areEqual('static', node.getComputedStyle('position'), 'before horizontal scrolling position should be static');

            setTimeout(function () {
                win.scrollTo(350, 0);
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('fixed', node.getComputedStyle('position'), 'after horizontal scrolling position should be fixed');
                        var left = node.getComputedStyle('left');
                        Assert.areEqual(offset, left.substr(0, left.length - 2), 'after scrolling horizontal position should equal offset');
                        node.unplug(Y.Plugin.Affix);
                    });
                }, 10);
            }, 20);

            test.wait();
        }

    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
