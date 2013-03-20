document.addEventListener("DOMContentLoaded", function() {
	
	window.setTimeout(function () {
	
		var scrollSource = document.body.querySelector("#wrapper");
		var container = document.body.querySelector("#wrapper");
	
		var table = container.querySelector("table");
		var topRow = container.querySelector("table tr:first-child");

		var allTopRowCells = container.querySelectorAll("table tr:first-child td");
		var firstRowCells = container.querySelectorAll("table tr:first-child + tr td");

		var allLeftColumnCells = container.querySelectorAll("table tr td:first-child");
		var firstColumnCells = container.querySelectorAll("table tr td:first-child + td");
	
		var leftColumnContainer = container.querySelector(".leftColumn");
		var topRowContainer = container.querySelector(".topRow");

		leftColumnContainer.style.overflow = "hidden";
		topRowContainer.style.overflow ="hidden";		
		
		((function(){
	
			((function () {
		
				var resetHeaders = function (event) {
		
					if (table.mutating)
						return;
		
					table.mutating = true;
		
					leftColumnContainer.style.width = allLeftColumnCells[0].getBoundingClientRect().width + "px";
					topRowContainer.style.height = allTopRowCells[0].getBoundingClientRect().height + "px";
		
					$(topRowContainer).empty().append(
						$("<table>").append(
							$("<tr>").append(
								$.map(allTopRowCells, function(obj, i) {
								  return $(obj).clone(false)
										.css("min-width", obj.getBoundingClientRect().width + "px")
										.css("box-sizing", "border-box");
								})
							)
						)
					);
		
					$(leftColumnContainer).empty().append(
						$("<table>").append(
							$.map(allLeftColumnCells, function (obj, i) {
								return $("<tr>").append(
									$(obj).clone(false)
										.css("height", obj.getBoundingClientRect().height + "px")
										.css("box-sizing", "border-box")
									);
							})
						)
					);
			
					table.mutating = false;
		
				}
	
				table.addEventListener("DOMSubtreeModified", resetHeaders);
				resetHeaders();
		
			})());
	
			var element = container.querySelector("#content");
			var tableRect = table.getBoundingClientRect();
			element.style.width = tableRect.width + "px";
			element.style.height = tableRect.height + "px";
	
			if ('ontouchstart' in window) {
		
				var tile = function (event, left, top) {

					var containerRect = container.getBoundingClientRect();
					var tableRect = table.getBoundingClientRect();
			
					topRowContainer.style.width = containerRect.width + Math.min(0, tableRect.right - containerRect.right) + "px";
					topRowContainer.style.left = Math.max(0, left) + "px";
					topRowContainer.style.top = Math.max(0, top) + "px";
					topRowContainer.scrollLeft = left;
			
					leftColumnContainer.style.height = containerRect.height + Math.min(0, tableRect.bottom - containerRect.bottom) + "px";
					leftColumnContainer.style.left = Math.max(0, left) + "px";
					leftColumnContainer.style.top = Math.max(0, top) + "px";
					leftColumnContainer.scrollTop = top;
			
				};
		
				new EasyScroller(element, {
					scrollingX: true,
					scrollingY: true,
					zooming: false,
					minZoom: 1.0,
					maxZoom: 1.0
				}, function (left, top, zoom) {
					tile(null, left, top);
				});
		
			} else {
	
				container.style.overflow = "scroll";
		
				var tile = function (event, left, top) {
					leftColumnContainer.scrollTop = top || container.scrollTop;
					topRowContainer.scrollLeft = left || container.scrollLeft;
				};
			
				var size;
				function scrollbarSize () {
				
					// http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
					// http://www.alexandre-gomes.com/?p=115
					// https://github.com/LearnBoost/antiscroll/pull/40
				
				  var inner = document.createElement('p');
				  inner.style.width = "100%";
				  inner.style.height = "200px";

				  var outer = document.createElement('div');
				  outer.style.position = "absolute";
				  outer.style.top = "0px";
				  outer.style.left = "0px";
				  outer.style.visibility = "hidden";
				  outer.style.width = "200px";
				  outer.style.height = "150px";
				  outer.style.overflow = "hidden";
				  outer.appendChild (inner);

				  document.body.appendChild (outer);
				  var w1 = inner.offsetWidth;
				  outer.style.overflow = 'scroll';
				  var w2 = inner.offsetWidth;
				  if (w1 == w2) w2 = outer.clientWidth;

				  document.body.removeChild (outer);

				  return (w1 - w2);
				
				};
			
				$(window).resize(function (event) {
					containerRect = container.getBoundingClientRect();
					topRowContainer.style.top = containerRect.top + "px";
					topRowContainer.style.left = containerRect.left + "px";
					topRowContainer.style.right = (document.body.clientWidth - containerRect.right) + "px";
					topRowContainer.style.width = "auto";
					leftColumnContainer.style.top = containerRect.top + "px";
					leftColumnContainer.style.left = containerRect.left + "px";
					leftColumnContainer.style.bottom = (document.body.clientHeight - containerRect.bottom) + "px";
					leftColumnContainer.style.height = "auto";
				}).trigger("resize");
			
				if (scrollbarSize() <= 0) {
			
					container.addEventListener("scroll", function (event) {
						tile(event);
					});

					tile();
			
				} else {
			
					var massageSize = function (container, boxElement, innerElement) {
				
						var containerClientRect = container[0].getBoundingClientRect();
						var boxElementPadding = boxElement.padding();
						var toWidth = containerClientRect.width - boxElementPadding.left - boxElementPadding.right;
						var toHeight = containerClientRect.height - boxElementPadding.top - boxElementPadding.bottom;
				
						boxElement.width(toWidth).height(toHeight);
						innerElement.width(toWidth + scrollbarSize()).height(toHeight + scrollbarSize());
				
					}
				
					var $container = $(container);
					var $box = $("<div>").addClass("antiscroll-box");
					var $inner = $("<div>").addClass("antiscroll-inner");
			
					$(container)
						.css("overflow", "hidden")
						.addClass("antiscroll-wrap").children().wrap($box);
			
					$(element).wrap($inner);
					$inner = $(element).parent("div").first();
			
					massageSize($container, $box, $inner);
					$(container).antiscroll();
					massageSize($container, $box, $inner);
			
					$inner[0].addEventListener("scroll", function (event) {
						tile(null, $inner[0].scrollLeft, $inner[0].scrollTop);
					});
			
				}
			
			}
		
			$(table).addClass("initialized");
			leftColumnContainer.style.visibility = "visible";
			topRowContainer.style.visibility = "visible";

		})());
	
	}, 250);

});
