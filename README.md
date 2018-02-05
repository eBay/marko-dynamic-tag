# `marko-dynamic-tag`

Tag which allows dynamic loading of Marko v3 components

## Usage

This tag is useful when you would otherwise have to loop over a large list of custom components. In that case you would typically need to check the name of each individual component, like so:
```
<for(c in data.components)>
    <component1 if(c.name === 'component1')/>
    <component2 else-if(c.name === 'component2')/>
    <component3 else-if(c.name === 'component3')/>
    ...
</for>
```

This verbosity can be reduced with `dynamic-tag`:
```
<for(c in data.components)>
    <dynamic-tag options=c.options model=c.model extra=c.extra/>
</for>
```

## Caveats
- `w-id` behavior is slightly different, see https://github.com/marko-js/marko-widgets/issues/49
- `w-*` attributes aside from `w-id`, such as `w-onchange`, can not be used now
- It is up to the caller of `<dynamic-tag>` to load the necessary dependencies for any template or widget that could be called. There may be cases where this is not possible, but we otherwise have no way to dynamically require files into a lasso bundle.

## API
### options
(required) Data used to find and load the component.
```js
{
    path: string
    isWidget: boolean (optional)
    widgetId: string (optional)
}
```
##### path (required)
An absolute path to the component root. For a component located at `src/components/component-name/`, the path would be `/path/to/project/root/src/components/component-name/`. This is needed because `<dynamic-tag>` has no default context of where it was called from.

##### isWidget (optional, default: false)
Set `widget` to `true` to invoke the component as a widget.

##### widgetId (optional (default: '')
If `widget` is set to `true`, this will be the ID that the widget is invoked with, using `w-id`.

### model
(optional) Primary data model that is passed to the component.

### extra
(optional) Secondary data model that is passed to the component. It is temporary until we can pass an arbitrary number of data models without breaking existing usage.

## Roadmap
- Support arbitrary number of data models
- Support Marko v4

## License

Copyright (c) 2018 eBay Inc.

Use of this source code is governed by a MIT-style license that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
