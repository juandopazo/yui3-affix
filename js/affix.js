/**
A plugin that makes a node stick to a position when it scrolls over a certain
offset. Based on Bootstrap's Affix plugin.

@class Plugin.Affix
@extends Plugin.Base
@constructor
@param {Object} config Object literal containing configuration options
@param {Object} config.host Node or widget (the boundingBox will be used)
@param {Object|Number} [config.offset] The offset to use. If not found it will
    default to data-offset-top, data-offset-left or data-offset properties on
    the host
@param {Number} [config.offset.left] Left offset to use. At least one of top or
    left should be used
@param {Number} [config.offset.top] Top offset to use.
**/
function Affix() {
    Affix.superclass.constructor.apply(this, arguments);
}
Y.extend(Affix, Y.Plugin.Base, {
    /**
    Get the correct node when plugged in Nodes or Widgets

    @method _getNode
    @return Node
    @private
    **/
    _getNode: function () {
        var node;

        if (!this._node) {
            node = this.get('host');

            if (Y.Widget && node instanceof Y.Widget) {
                node = node.get('boundingBox');
            }

            this._node = node;
        }

        return this._node;
    },
    initializer: function () {
        var node = this._getNode(),
            xy = node.getXY();

        /**
        The original left position of the node. Used to calculate if the node is
        over the offset.

        @property _x
        @type Number
        @private
        **/
        this._x = xy[0];
        /**
        The original top position of the node. Used to calculate if the node is
        over the offset.

        @property _y
        @type Number
        @private
        **/
        this._y = xy[1];

        /**
        Event handle for the document's `scroll` event.

        @property _handles
        @type Array
        @private
        **/
        this._handles = [
            // The scroll event fires too often, almost as much as the mousemove
            // event. Throttle it to avoid touching the DOM so many times
            // per second
            Y.on('scroll', Y.throttle(Y.bind(this.refresh, this), 15)),
            // Throttling can silence the last scroll event fired by the browser
            // Debouncing always gets called after all throttled events to
            // avoid occasional fast scrolls that cause the node not to change
            // its fixed state
            Y.on('scroll', Y.debounce(15, this.refresh), null, this)
        ];

        this.refresh();
    },
    /**
    Fixes or releases the node according to the scroll position.
    Called automatically when scrolling.

    @method refresh
    **/
    refresh: function () {
        var offset = this.get('offset'),
            offsetLeft = offset.left,
            offsetTop = offset.top,

            // do the math for both directions even though it may be set for
            // only one direction for simplicity
            // Do the vertical calculation first since that is the most common
            // use case
            isOverOffset = (offsetTop && this._y - Y.DOM.docScrollY() < offsetTop) ||
                            (offsetLeft && this._x - Y.DOM.docScrollX() < offsetLeft);

        // reset position styles if no offset was provided in that direction
        // because if an inline style was applied it'll break sooner or
        // later because of the changed to "fixed" position
        this._getNode().setStyles({
            position: isOverOffset ? 'fixed' : '',
            left: isOverOffset && offsetLeft ? (offsetLeft + 'px') : '',
            top: isOverOffset && offsetTop ? (offsetTop + 'px') : ''
        });
    },
    destructor: function () {
        Y.Array.each(this._handles, function (handle) {
            handle.detach();
        });
        this._handles = this._node = null;
    }
}, {
    ATTRS: {
        offset: {
            setter: function (value) {
                return typeof value === 'number' ? {
                    top: value,
                    left: value
                } : value;
            },
            valueFn: function () {
                var node = this._getNode(),
                    data = parseInt(node.getData('offset'), 10),
                    offset = {};

                if (Y.Lang.isNumber(data)) {
                    offset.top = offset.left = data;
                } else {
                    offset.left = parseInt(node.getData('offset-left'), 10);
                    offset.top = parseInt(node.getData('offset-top'), 10);
                }

                if (!offset.left && !offset.top) { Y.log('no offset provided', 'info'); }

                return offset;
            }
        }
    }
});

/**
Plugin namespace

@property NS
@type String
@default "affix"
@static
**/
Affix.NS = 'affix';

Y.namespace('Plugin').Affix = Affix;
