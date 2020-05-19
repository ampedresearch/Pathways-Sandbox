# Pathways and Facings Sandbox


Interactive app for visualizing common pathways and facings in dance.

## Running

To run locally, download the source folder, fire up a local server, and navigate to it in your browser. For example:
```
$ python -m SimpleHTTPServer
```


## Known Errors

"Custom" mouse-click center option makes it so dancers cannot be scaled. A map() in Dot scales the position over SimDancer.scale value - may have to find a different way to scale dancers.

Removing a Dancer while it is the target of another dancer causes the application to crash - need to implement error / "no dancer position" handling

Updating a dancer's trace length from the UI does not work

Scaling - the scaling of the dancers is not dynamic (hardcoded in SimDancer initialization). SimDancer.updateScale could be used to update the "stage" scale to the width or height of the canvas div (which IS dynamic).