document.addEventListener("DOMContentLoaded", function() {
	
	window.setTimeout(function () {
	
		var scrollSource = document.body.querySelector("#wrapper");
		var $container = $("#wrapper");
		var $element = $container.children("#content");
		
		var $table = $container.find("table");
		
		$table.find("tr").each(function(idx, obj) {
			if (idx > 10) {
				$(obj).remove();
			}
			$(obj).find("td").each(function(idx, obj) {
				if (idx > 10) {
					$(obj).remove();
				}
			})
		});
		
		var $topRow = $table.children("tr:first-child");
		
		var $leftColumnContainer = $container.find(".leftColumn");
		var $topRowContainer = $container.find(".topRow");
		
		var $topRowCells = $table.find("tr:first-child td");
		var $firstRowCells = $table.find("tr:first-child + tr td");
		var $leftColumnCells = $table.find("tr td:first-child");
		var $firstColumnCells = $table.find("tr td:first-child + td");
		
		$leftColumnContainer.css("overflow", "hidden");
		$topRowContainer.css("overflow", "hidden");	
		
		var $leftColumnTable;
		var $topRowTable;
		
		((function(){
			
			((function () {
		
				$table.bind("DOMSubtreeModified", function (event) {
		
					if (this.mutating)
						return;
		
					this.mutating = true;
		
					$leftColumnContainer.width($leftColumnCells[0].getBoundingClientRect().width);// + "px";
					$topRowContainer.height($topRowCells[0].getBoundingClientRect().height);// + "px";
					
					$leftColumnTable = $("<table>")
						.css("position", "relative")
						.append(
							$.map($leftColumnCells, function (obj, i) {
								return $("<tr>").append(
									$(obj).clone(false)
										.css("height", obj.getBoundingClientRect().height + "px")
										.css("box-sizing", "border-box")
									);
							})
						);
					
					$topRowTable = $("<table>")
						.css("position", "relative")
						.append(
							$("<tr>").append(
								$.map($topRowCells, function(obj, i) {
								  return $(obj).clone(false)
										.css("min-width", obj.getBoundingClientRect().width + "px")
										.css("box-sizing", "border-box");
								})
							)
						);
		
					$leftColumnContainer.empty().append($leftColumnTable);
					$topRowContainer.empty().append($topRowTable);
			
					this.mutating = false;
		
				}).trigger("DOMSubtreeModified");
		
			})());
	
			var tableRect = $table[0].getBoundingClientRect();
			$element.width(tableRect.width);
			$element.height(tableRect.height);
	
			if (('ontouchstart' in window)) {
		
				new EasyScroller($element[0], {
					
					scrollingX: true,
					scrollingY: true,
					zooming: false,
					minZoom: 1.0,
					maxZoom: 1.0
					
				}, function (left, top, zoom) {
					
					var topRowContainer = $topRowContainer[0];
					var leftColumnContainer = $leftColumnContainer[0];
					
					var containerRect = $container[0].getBoundingClientRect();
					var tableRect = $table[0].getBoundingClientRect();
					
					var containerOffsetX = Math.floor(Math.max(0, left)) + "px";
					var containerOffsetY = Math.floor(Math.max(0, top)) + "px";
					var elementOffsetX = -1 * Math.floor(Math.max(0, left)) + "px";
					var elementOffsetY = -1 * Math.floor(Math.max(0, top)) + "px";
					
					topRowContainer.style.width = Math.round(containerRect.width + Math.min(0, tableRect.right - containerRect.right)) + "px";
					topRowContainer.style.left = containerOffsetX;
					topRowContainer.style.top = containerOffsetY;
					
					leftColumnContainer.style.height = Math.round(containerRect.height + Math.min(0, tableRect.bottom - containerRect.bottom)) + "px";
					leftColumnContainer.style.left = containerOffsetX;
					leftColumnContainer.style.top = containerOffsetY;
					
					topRowContainer.scrollLeft = left;
					leftColumnContainer.scrollTop = top;
					// $topRowTable[0].style.left = elementOffsetX;
					// $leftColumnTable[0].style.top = elementOffsetY;
					
					// topRowContainer.scrollLeft = left;
					// leftColumnContainer.scrollTop = top;
					
				});
		
			} else {
				
				$container.css("overflow", "scroll");
		
				var tile = function (event, left, top) {
					$leftColumnContainer[0].scrollTop = top || $container[0].scrollTop;
					$topRowContainer[0].scrollLeft = left || $container[0].scrollLeft;
				};
			
				var size;
				function scrollbarSize () {
				
					// http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
					// http://www.alexandre-gomes.com/?p=115
					// https://github.com/LearnBoost/antiscroll/pull/40
					
					var $inner = $("<p>").width("100%").height("200px");
					var inner = $inner[0];
				
				  // var inner = document.createElement('p');
				  // inner.style.width = "100%";
				  // inner.style.height = "200px";

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
					
					var containerRect = $container[0].getBoundingClientRect();
					
					$topRowContainer
						.css("top", containerRect.top)
						.css("left", containerRect.left)
						.css("right", (document.body.clientWidth - containerRect.right))
						.css("width", "auto");
						
					$leftColumnContainer
						.css("top", containerRect.top)
						.css("left", containerRect.left)
						.css("bottom", (document.body.clientHeight - containerRect.bottom))
						.css("height", "auto");
					
				}).trigger("resize");
			
				if (scrollbarSize() <= 0) {
			
					$container.bind("scroll", function (event) {
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
				
					// var $container = $(container);
					var $box = $("<div>").addClass("antiscroll-box");
					var $inner = $("<div>").addClass("antiscroll-inner");
			
					$container
						.css("overflow", "hidden")
						.addClass("antiscroll-wrap").children().wrap($box);
			
					$element.wrap($inner);
					$inner = $(element).parent("div").first();
			
					massageSize($container, $box, $inner);
					$container.antiscroll();
					massageSize($container, $box, $inner);
			
					$inner[0].addEventListener("scroll", function (event) {
						tile(null, $inner[0].scrollLeft, $inner[0].scrollTop);
					});
			
				}
			
			}
		
			$table.addClass("initialized");
			$leftColumnContainer.css("visibility", "visible");
			$topRowContainer.css("visibility", "visible");

		})());
	
	}, 250);

});
