YUI Affix
===========

![Travis Build Status](https://api.travis-ci.org/juandopazo/yui3-affix.png)

A Bootstrap-inspired Affix plugin for YUI.

Getting Started
---------------

Create a new YUI instance for your application and populate it with the modules you need by specifying them as arguments to the `YUI().use()` method. YUI will automatically load any dependencies required by the modules you specify. Then plug the Affix plugin to any node you want to fix.

```html
<script>
YUI({
    gallery: 'gallery-2013.05.15-21-12'
}).use('gallery-affix', function (Y) {
    
    Y.one('#navbar').plug(Y.Plugin.Affix, {
        offset: {
            top: 100
        }
    });

});
</script>
```

Alternatively you can set the offset as a `data-` attribute of the plugged node.

```html
<div class="affix" data-offset-top="100">...</div>
```
