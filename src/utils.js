export class Utils { 

  static GenerateRandomId () {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  }

  static ConvertCssClassToJQuerySelector(cssClass){
    return cssClass.replace(/(^ *| +)/g, '.');
  }

  static Debounce(callback, milliseconds, leading){
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      let later = function () {
        timeout = null;
        if (!leading) {
          callback.apply(context, args);
        }
      };
      let callNow = leading && !milliseconds;
      clearTimeout(timeout);
      timeout = setTimeout(later, milliseconds);
      if (callNow) {
        callback.apply(context, args);
      }
    };
  }

  static IsElementThrottled($, element, milliseconds){

    Utils.recentDragMouseOvers = Utils.recentDragMouseOvers || [];

    let d = new Date();
    let n = d.getTime();
    for (let i = 0; i < Utils.recentDragMouseOvers.length; i++) {
      if (Utils.recentDragMouseOvers[i].n + milliseconds < n) {
        // expired.
        Utils.recentDragMouseOvers.splice(i, 1);
      }
      if (i < Utils.recentDragMouseOvers.length && $(Utils.recentDragMouseOvers[i].e).is(element)) {
        return true;
      }
    }
    Utils.recentDragMouseOvers.push({
      n: n,
      e: element
    });
    return false;
  }

  static SwapJQueryElements($a, $b){
    let getInPlaceFunction = function ($element) {
      let $other = $a.is($element) ? $b : $a;
      let $next = $element.next();
      let $prev = $element.prev();
      let $parent = $element.parent();
      // cannot swap a with b exactly if there are no other siblings.
      if ($next.length > 0 && !$next.is($other)) {
        return function ($newElement) {
          $next.before($newElement);
        }
      } else if ($prev.length > 0 && !$prev.is($other)) {
        return function ($newElement) {
          $prev.after($newElement);
        }
      } else {
        // no siblings, so can just use append
        return function ($newElement) {
          $parent.append($newElement);
        }
      }
    };

    let aInPlaceFunc = getInPlaceFunction($a);
    let bInPlaceFunc = getInPlaceFunction($b);
    let $aDetached = $a.detach();
    let $bDetached = $b.detach();
    // swap finally.
    bInPlaceFunc($aDetached);
    aInPlaceFunc($bDetached);
  }

  static DetachAndInsertInPlaceJQueryElement ($detachElement, $inPlaceElement) {
    var inPlaceElementIndex = $inPlaceElement.index();
    var detachElementIndex = $detachElement.index();

    var $detachedElement = $detachElement.detach();

    if (inPlaceElementIndex < detachElementIndex) {
      $inPlaceElement.before($detachedElement);
    } else {
      $inPlaceElement.after($detachedElement);
    }
  }

  static ClearAbsoluteCSS($element){
    $element.css('top', '');
    $element.css('left', '');
    $element.css('width', '');
    $element.css('height', '');
  }

  static GetAbsoluteOffsetForElementFromMouseEvent($element, mouseEvent, adjustment){
    let $parent = $element.parent();      
    let parentOffset = $parent.offset();
    let parentPosition = $parent.position();

    let absoluteX = parentOffset.left - parentPosition.left;
    let absoluteY = parentOffset.top - parentPosition.top;

    let left = mouseEvent.pageX - absoluteX - adjustment.x;
    let top = mouseEvent.pageY - absoluteY - adjustment.y;  

    return {
      left: left,
      top: top
    };
  }

  static GetPositionAndSizeOfCell($cell){ 
    
    var position = $cell.position();
    var w = $cell.outerWidth();
    var h = $cell.outerHeight();

    return {
      left: position.left,
      top: position.top,
      width: w,
      height: h
    };
  }

}