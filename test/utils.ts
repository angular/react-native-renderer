export function fireEvent(name: string, target: any, timeStamp: number = 0, touches: Array<Array<number>> = [[0,0]], changedIndices: Array<Number> = [0]) {
  var t: any[] = [];
  for (var i = 0; i < touches.length; i++) {
    t.push({clientX: touches[i][0], clientY: touches[i][1]});
  }
  var event = {
    type: name,
    clientX: touches[0][0],
    clientY: touches[0][1],
    touches: t,
    changedIndices: changedIndices,
    timeStamp: timeStamp,
    target: target,
    preventDefault: () => {},
    _stop: false
  };
  event['stopPropagation'] = () => {
    event._stop = true;
  };
  target.fireEvent(name, event);

}