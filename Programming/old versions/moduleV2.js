/* Issues:
- you can make a relative link to the file for a class but not the content.  The difference is 	that, when you link the file, the file will load in the iframe but the rest of the page will still reflect the original content.  So, hyperlinks to the content will break if taken out of context.

- hideEmptyTables needs to check both the primary and secondary pages for content -- right now it is just checking primary (I think - not tested)

- change [pre] in code only if it does not have its own class already

- copy/paste puts [br] in text -- make that into code?

- instructors still have to put in hash tag hyperlinks in HTML
  -- set an ID and do in JS
  
- change absolute links in D2L back to relative links

- D2L autogenerates figcaptions
  -- set a class called caption and change in JavaScript
  
- Copying code within code causes nested [address]
  -- color it red in editor to give warning
 
- Nothing asking if user should save changes when exiting page

- Cannot set style to multiple block objects -- will set to parent object 

- blank address lines are not counted in editor or browsers
  -- browser: Javascript add space
  -- editor: add min-height

- copy code from outside source puts in <br>

*/
smallImageHeight = 100;			// set the height of flex-sized images when small 
imageHeight = new Array();		// the heights of all flex-sized images in a page
imageWidth = new Array();		// the widths of all flex-sized images in a page
minImageWidth = 700;				// minimum width for a flexSize image in expanded mode
scrollTopPosition = 0; 			// value saved for links-return-links within a page
returnLink = null;				// element on page that contains the return link

addStyleSheet();  // can be done before page load since this is called in the [head]

window.onload = function()
{		
	// set title on webpage
	window.document.title = document.getElementById("title").textContent;
	
	createFlexImages();
	editModeStyles();
	hideEmptyTables();
	addAnchorLink();
	captionImages();
	fixHashTagFF();
	rightClickMenu("create");
	addDivs("H1");
	addDivs("H2");
	addDivs("H3");
	// need to add the divs before doing the code tags becuase this includes the div codeblocks
	addCodeTags();	
	addDownloadLinks();
/*****
	This section has been deprecated -- replaced with right-click functionality

	// create buttons that maximize and minimize all the flex-pictures in the lesson
/*	if(flexImage.length > 1)
	{		
		var elemDiv = document.createElement('div');
		elemDiv.style.cssText = "";
		elemDiv.classList.add("resize");
		elemDiv.innerHTML = "Max Pics";
		elemDiv.addEventListener("click", 
			function()
			{
				var flexImage = document.getElementsByClassName("flexSize");
				for(i=0; i<flexImage.length; i++)
				{
					changeSize(flexImage[i], "maximize")
				}
			}, false)
		document.body.appendChild(elemDiv);
		
		var elemDiv = document.createElement('div');
		elemDiv.style.cssText = "bottom: 40px;";
		elemDiv.classList.add("resize");
		elemDiv.innerHTML = "Min Pics";
		elemDiv.addEventListener("click", 
			function()
			{
				var flexImage = document.getElementsByClassName("flexSize");
				for(i=0; i<flexImage.length; i++)
				{
					changeSize(flexImage[i], "minimize")
				}
			}, false)
		document.body.appendChild(elemDiv);
	}
	*****/
}
/*******************************************
function addDivs()
{
	h2Elements = document.getElementsByTagName("h2");
	h3Elements = document.getElementsByTagName("h3");
	//newDiv = new Array();
	for(i=0; i<h2Elements.length; i++)
	{
		currentElement = h2Elements[i];
		nextSibling = null;
		// create a new div
		newDiv = document.createElement("div");
		
		newDiv.style.backgroundColor = "green";
		newDiv.style.border = "solid 2px lime";
		
		document.body.insertBefore(newDiv, h2Elements[i]);
		
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;
			newDiv.appendChild(currentElement);
			currentElement = nextSibling;
		}			
		
		newDiv.style.borderTopRightRadius = "10px";
		newDiv.style.borderTopLeftRadius = "10px";
		
		if(currentElement.nextElementSibling == null ||
			currentElement.nextElementSibling.tagName == "H2" ||
			currentElement.nextElementSibling.tagName == "DIV")
		{
			newDiv.classList.add("h2NextDiv");
			//newDiv.style.borderBottomRightRadius = "10px";
			//newDiv.style.borderBottomLeftRadius = "10px";		
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.classList.add("h3NextDiv");
			//newDiv.style.borderBottomRightRadius = "0px";
			//newDiv.style.borderBottomLeftRadius = "0px";			
		}
		newDiv.appendChild(currentElement);	
	}
	for(i=0; i<h3Elements.length; i++)
	{
		currentElement = h3Elements[i];
		nextSibling = null;
		// create a new div
		newDiv = document.createElement("div");

		document.body.insertBefore(newDiv, h3Elements[i]);
		newDiv.style.backgroundColor = "green";
		newDiv.style.border = "solid 2px lime";
		
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;
			newDiv.appendChild(currentElement);
			currentElement = nextSibling;
		}
		newDiv.style.borderTopRightRadius = "0px";
		newDiv.style.borderTopLeftRadius = "0px";
			
		if(currentElement.nextElementSibling == null ||
			currentElement.nextElementSibling.tagName == "H2" ||
			currentElement.nextElementSibling.tagName == "DIV")
		{
			newDiv.style.borderBottomRightRadius = "10px";
			newDiv.style.borderBottomLeftRadius = "10px";		
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.style.borderBottomRightRadius = "0px";
			newDiv.style.borderBottomLeftRadius = "0px";			
		}
		newDiv.appendChild(currentElement);	
	}	
	
}
*/

/*
Find all images within the page that have the "flexSize" class
and add onclick events that give the user the ability to change 
the size of the image.  Called on page load.
*/
function createFlexImages()
{
	// find all elements that have the class name "flexSize"
	var flexImage = document.getElementsByClassName("flexSize");

	for(i=0; i<flexImage.length; i++)	// for each flexSize element
	{
		// add an onclick event that calls changeSize() to each flexSize image
		flexImage[i].addEventListener("click", function()
												{ changeSize(this) }, false); 
		
		/*** the strange behavior of JS and for loops: final value of the loop  ****/
		
		flexImage[i].myIndex = i;  	// give every image a unique index value
		
		// store the values of the images natural width and height
		imageHeight[i] = flexImage[i].naturalHeight;
		imageWidth[i] = flexImage[i].naturalWidth;
		
		// initalize the flex image to the small size
		changeSize(flexImage[i], "minimize")
	}
}

/*
function called when a flexSize image is clicked --
changes the size of images between small and large

possible instruction values: minimize and maximize
*/
function changeSize(element, instruction="none")
{
	// get unique index of image
	imageIndex = element.myIndex;				
	
	// get the images natural width and height unsing the index
	origHeight = imageHeight[imageIndex];
	origWidth = imageWidth[imageIndex];
	
	// If image is in small sized mode and insruction is not "minimize"
	// The reason I do not put instruction == "minimize" has to do with minimize/maximize all call
	if(element.style.height == smallImageHeight + "px" && instruction != "minimize")
	{
		// get the width of the images parent element, which is a [figure]
		screenWidth = element.parentElement.clientWidth;
		
		// if the width is less than the min width, increase the width to the min width
		if(screenWidth < minImageWidth)
		{
			screenWidth = minImageWidth;
		}
		
		// if the natural width of the image is smaller than the screen width...
		if(origWidth <= screenWidth)
		{
			// set the image to its natural size
			element.style.width = origWidth + "px";
			element.style.height = origHeight + "px";
		}
		else  // image's natural width is larger than screen width
		{
			// set the image width to the screen width and scale the height
			element.style.width = screenWidth + "px";
			element.style.height = (screenWidth/origWidth)*origHeight + "px";
		}
	}
	else if (instruction != "maximize")
	{
		// set the images height to the smallHeight value and scale the with to match
		element.style.height = smallImageHeight + "px";	
		element.style.width = (smallImageHeight/origHeight)*origWidth + "px";
	}
}

/*
Finds all elements with class "linkTo" and converts them into an anchor link--
D2L does not allow the user to use an anchor link as a hyperlink hence the workaround
using classes
*/
function addAnchorLink()
{
	// find all elements that have the class name "linkTo"
	linkElements = document.getElementsByClassName("linkTo");
	
	for(i=0; i<linkElements.length; i++)	// for each linkTo element
	{
		// the id of the linkTo elements is: "link-<id_of_element_linked_to>"
		id = linkElements[i].id;
		linkToId = id.slice(5);	// this line remove the "link-" part of the id (which is 5 characters)
		
		tempHTML = linkElements[i].innerHTML;	// get the content of the linkTo element
		linkElements[i].innerHTML = "";			// empty the content
		
		linkElement = document.createElement("a");	// create a new link element
		linkElement.href = "#" + linkToId;				// add the anchor link reference
		linkElement.innerHTML = tempHTML;				// add the content
		
		// add the new link element with proper anchor link
		linkElements[i].appendChild(linkElement);
		
		/*
		Essentially we are going 
			from		
		<p class="linkTo" id="link-to-here"> I am the content </p>
			to
		<p class="linkTo" id="link-to-here"> <a href="#to-here"> I am the content </a> </p>
		*/
	}
}

/* uses the header structure of the page to create a visual style with div elements --
	user passes in the elementType they want to structure (H1, H2, and H3 are currently supported
*/ 
function addDivs(elementType)
{
	// find all element of the type asked for (H1, H2, and H3 currently supported)
	elements = document.getElementsByTagName(elementType);
	
	// for each element
	for(i=0; i<elements.length; i++)
	{
		// create a temporary element at the same location of the Header element
		currentElement = elements[i];
		nextSibling = null;
	
		newDiv = document.createElement("div");	// create a new div
		newDiv.classList.add("contentDiv");			// add a class name to the div
					
		// insert the new div right before the Header element
		document.body.insertBefore(newDiv, elements[i]);
		
		/*
			Go from 
			<h2> Header title </H2>
				<p>more content</p>
				<p>more content</p>
				<p>more content</p>
			<h3>
			
			to
			
			<div class="">
				<h2> Header title </H2>
				<p>more content</p>
				<p>more content</p>
				<p>more content</p>
			</div>
			<h3>  -- this last element could also be <h2>, <div>, or end-of-page
		*/
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;	// get the next element
			newDiv.appendChild(currentElement);						// add current element to div
			currentElement = nextSibling;								// set current element to next element
		}	

		// add the page title class to the div with H1
		if(elementType == "H1")
		{	
			newDiv.classList.add("title");
		}
		else if(elementType == "H2")
		{	
			// add the class "h2Div" to div with H2
			newDiv.classList.add("h2Div");
			
			// add "nonlinear" class for div that contain non-linear content
			if((elements[i].className != "" ) &&
				(elements[i].classList.contains("trap") ||
				elements[i].classList.contains("extension") ||
				elements[i].classList.contains("shortcut")) )
			{
				newDiv.classList.add("nonlinear");
			}
		}
		else if(elementType == "H3")
		{	
			// add the class "h3Div" to div with "H3"
			newDiv.classList.add("h3Div");
			
			// Check to see if the previous sibling (div with H2 or H3) has class "nonlinear"
			// if so -- then this div should also be class "nonlinear"
			if(newDiv.previousElementSibling.className != "" &&
				(newDiv.previousElementSibling.classList.contains("nonlinear") ))
			{
				newDiv.classList.add("nonlinear");
			}
		}	

		// figure out what the next div is -- basically this determines
		// if this content is the middle or end of a section 
		if(elementType != "H1" && 
				(currentElement.nextElementSibling == null ||
				 currentElement.nextElementSibling.tagName == "H2" ||
				 currentElement.nextElementSibling.tagName == "DIV" ))
		{
			newDiv.classList.add("h2NextDiv");	// it is the end of a section
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.classList.add("h3NextDiv");	// it is the middle of a section
		}
		newDiv.appendChild(currentElement);	// add content to the new div
	}
}

/********
function addDivs()
{
	h2Elements = document.getElementsByTagName("h2");
	h3Elements = document.getElementsByTagName("h3");
	//newDiv = new Array();
	for(i=0; i<h2Elements.length; i++)
	{
		currentElement = h2Elements[i];
		nextSibling = null;
		// create a new div
		newDiv = document.createElement("div");
		
		newDiv.style.backgroundColor = "green";
		newDiv.style.border = "solid 2px lime";
		
		document.body.insertBefore(newDiv, h2Elements[i]);
		
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;
			newDiv.appendChild(currentElement);
			currentElement = nextSibling;
		}			
		
		newDiv.style.borderTopRightRadius = "10px";
		newDiv.style.borderTopLeftRadius = "10px";
		
		if(currentElement.nextElementSibling == null ||
			currentElement.nextElementSibling.tagName == "H2" ||
			currentElement.nextElementSibling.tagName == "DIV")
		{

			newDiv.style.borderBottomRightRadius = "10px";
			newDiv.style.borderBottomLeftRadius = "10px";		
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.style.borderBottomRightRadius = "0px";
			newDiv.style.borderBottomLeftRadius = "0px";			
		}
		newDiv.appendChild(currentElement);	
	}
	for(i=0; i<h3Elements.length; i++)
	{
		currentElement = h3Elements[i];
		nextSibling = null;
		// create a new div
		newDiv = document.createElement("div");

		document.body.insertBefore(newDiv, h3Elements[i]);
		newDiv.style.backgroundColor = "green";
		newDiv.style.border = "solid 2px lime";
		
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;
			newDiv.appendChild(currentElement);
			currentElement = nextSibling;
		}
		newDiv.style.borderTopRightRadius = "0px";
		newDiv.style.borderTopLeftRadius = "0px";
			
		if(currentElement.nextElementSibling == null ||
			currentElement.nextElementSibling.tagName == "H2" ||
			currentElement.nextElementSibling.tagName == "DIV")
		{
			newDiv.style.borderBottomRightRadius = "10px";
			newDiv.style.borderBottomLeftRadius = "10px";		
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.style.borderBottomRightRadius = "0px";
			newDiv.style.borderBottomLeftRadius = "0px";			
		}
		newDiv.appendChild(currentElement);	
	}	
	
}
*******/
/* onclick call from right-click menu in page to either minimize or maximize (param)
	all the flex-sized images in the page */
function changeAllPicSize(param)
{
	var flexImage = document.getElementsByClassName("flexSize");
	for(i=0; i<flexImage.length; i++)
	{
		/* calll changeSize passing each flexSize object in an array */
		changeSize(flexImage[i], param)
	}
}

/* Linkback function */
function goBackToPrevLocation()
{
	leftPos = window.parent.scrollX; 	// get the left position of the scroll
	returnLink.style.display = "none";	// make the return link disappear

	// scroll the page vertically to the position the page was
	// at when the link was originally clicked (stored as a global variable)
	window.parent.scrollTo(leftPos, scrollTopPosition);
	return false;	// so the page does not reload (don't ask why!)
}

function fixHashTagFF()
{
	var arrFrames = parent.document.getElementsByTagName("IFRAME");
	
	// create a return link
	returnLink = document.createElement("a");
	returnLink.innerHTML += "Go back to previous location";
	returnLink.href="";
	returnLink.id = "returnLink";
	returnLink.className = "linkback";
	returnLink.style.display = "none";
	returnLink.onclick = function()
	{
		goBackToPrevLocation();
		return false;		// stops the page from reloading -- unsure why!
	}
	// how much of the iframe is covered by the menus
	var iframeOffset = 0;
		
	/* you cannot directly link to a hash tag because it is in 
		an iframe.  Instead, you need to scroll the window to the hash tag */
	$("a").each(function () // for all anchors
	{
		var link = $(this);
		var href = link.attr("href");
		if (href && href[0] == "#")  // check for a hash tag
		{
			var name = href.substring(1);
			
			// when anchor is clicked...
			$(this).click(function () 
			{
				var nameElement = $("[name='" + name + "']");
				var idElement = $("#" + name);
				var element = null;
				
				if (nameElement.length > 0) 
				{
					element = nameElement;
				} 
				else if (idElement.length > 0) 
				{
					element = idElement;
				}
				if (element) 
				{
					var offset = element.offset();
					scrollTopPosition = window.parent.scrollY;  // save the value of the scroll position
					
					iframeOffset = window.parent.document.getElementsByTagName("iframe")[0].offsetTop;
					headerHeight = window.parent.document.getElementById("d2l_minibar").offsetHeight;
					totalScrollY = offset.top + iframeOffset - headerHeight
					window.parent.scrollTo(offset.left, totalScrollY);
					
					// put anchor at end of div that links back to old position
					document.getElementById(name).parentElement.appendChild(returnLink);
					returnLink.style.display = "block";
				}
				return false;
			});
		}
	});
}

	/* link to external CSS file 
		This is in the javascript because D2L will rewrite links in the HTML file */
function addStyleSheet()
{
	var CSSFile = document.createElement("link");
	CSSFile.href = "../../Programming/module.css";
	CSSFile.type = "text/css";
	CSSFile.rel = "stylesheet";
	CSSFile.media = "screen,print";
	document.getElementsByTagName("head")[0].appendChild(CSSFile);
}

function editModeStyles()
{
	/* Want to create in-page CSS that hides all of the headers - 
		External styles are ignored by the D2L editor, hence the need to use in-page. */
		
	/* does not work -- D2L does not load this in editor -- so commented out*/
	/*var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = "h1,h2,h3,h4,h5,h6 { visibility: hidden; height: 0px; with: 0px } " + 
						"p{ margin:0px; padding:0px; } " +
						"table{ margin-bottom: 10px; width: 100%; } " +
						"th { text-align: left; color: rgb(100,0,0); } " +
						"td { height: 18px; } " + 
						"body{ background-color: blue; }";
	document.head.appendChild(css);*/
}

/* the following code will conflict with the populate function-- change this later 
	also, need to make sure the style sheet is loaded before this function is called */
function hideEmptyTables()
{
	// create a list of all the tables
	var tables = document.getElementsByTagName("table");

	// for each table
	for(var i = 0; i < tables.length; i++)
	{
		// create a list of the cells in the table
		tableCells = tables[i].getElementsByTagName('td')
		
		// if the number of cells is zero or one with no content in it then make table invisible 
		if (tableCells.length == 0 || (tableCells.length == 1 && tableCells[0].innerHTML.trim() == ""))
		{
			tables[i].style.display = "none";
		}
	}
	
	// create a list of all the divs
	var div = document.getElementsByTagName("div");
		
	// for each div
	for(var i = 0; i < div.length; i++)
	{
		if(div[i].childElementCount <= 2)  // only check div with 0,1, or 2 child elements
		{	
			divIsEmpty = true;	// assume empty until something is found
			
			// 0 elements
			if(div[i].childElementCount == 0 && div[i].innerHTML.trim() != "")
			{
				divIsEmpty = false
			}
			
			// 1 element
			else if (div[i].childElementCount == 1 && 
						div[i].children[0].innerHTML.trim() != "")
			{
				divIsEmpty = false
			}
			
			// 2 elements
			else if (div[i].childElementCount == 2 && 
						 ( div[i].children[0].innerHTML.trim() != ""  || 
							div[i].children[1].innerHTML.trim() != ""))
			{
				divIsEmpty = false
			}			

			// if no content was found then hide the div
			if(divIsEmpty == true)
			{
				div[i].style.display = "none";
			}
		}
	}
}
	
function populate(primaryFile)
{	
	/*************************
	If the table in the secondary has content, then use that instead of the table from primary 
	In the future, the table IDs will be collected from the files 
	*****************************/

	var numSections = 11;	// have program count the number of sections instead?? Or jst go through each section??
	// path from secondary to primary file- this will probably be deprecated because the primaryFile argument will contain the path
	var pathToFile = "./";	
	var secondaryId = "s";
	var primaryId = "p";
	
	$(document).ready(function() 
	{
		$.ajax(
		{
			url: pathToFile + primaryFile,
			type:'GET',
			
			// source file was found and retrieved
			success: function(data)		
			{
				for(i=1; i<=numSections; i++)	// for each possible div in the destination file
				{
					// check if the desination div exists
					if (!($("#" + secondaryId + i).length))  // div has no length -- does not exist
					{							
						// create a new div, give it an ID, and add it to the beginning (prepend) of the body
						jQuery('<div/>',{"id": secondaryId + i}).prependTo('body');

						// move newly created div after the previous div if it is not the first div
						if(i != 1)
						{
							$("#" + secondaryId + i).insertAfter($("#" + secondaryId + (i-1))); 
						}
					}
					// check if the destination div has info in it already
						//  - somewhat redundant if I just created it
					if($("#" + secondaryId + i).is(':empty'))
					{
						// get data from the source 
						var sourceData = $(data).find(" #" + primaryId + i);
						
						// checks if source data exists (length) and if it contains anything
						if(sourceData.length  && !(sourceData.is(':empty'))) 
						{
							$("#" + secondaryId + i).html(sourceData.html());	// using Get
						}
						else 
						{
							$("#" + secondaryId + i).html("No Data " + i);
						}
					}
				}
			},
			
			// source file was not found
			error: function(data)
			{ 
				alert("Failed to open source file.");
			}
		});
	})
}

/* add the tag: [code] to each line inside a [pre] block */
function addCodeTags()
{
	/* this part works if we are using <address> with class="code" */
	var addrLines = document.getElementsByTagName("address");

	/* count the number of address tags
	   note: if you use addrLines.length in the for loop, the length will change
		as you add [address] tags -- creating an infinite loop */
	numAddrTags = addrLines.length;
	
	// first go through [address] elements and check for [br] tag -- switch to [address]
	for(i=0; i<numAddrTags; i++)
	{
		// need to be very careful in for loops where the counted element is changing
		codeElement = addrLines[i];
		
		/* fix the situation where code lines are broken up by [br] --
			usually happens when code was copied/pasted into editor */
		if(addrLines[i].getElementsByTagName("br").length > 0)
		{ 
			numLines = addrLines[i].getElementsByTagName("br").length +1; // no break on last line

			var codeText = new Array();
			for(j=0; j<numLines; j++)
			{
				codeText[j] = $(addrLines[i]).html().split("<br>")[j];
			}
			for(j=0; j<numLines; j++)
			{
				newElement = document.createElement("address");
				newElement.innerHTML = codeText[j];
				codeElement.parentElement.insertBefore(newElement, codeElement)
			}
			codeElement.parentElement.removeChild(codeElement);	
		}
	}

	firstLine = true;
	// now, go through all [address] including new one generated from above
	for(i=0; i<addrLines.length; i++)
	{
		// add "code" class to line
		addrLines[i].classList.add("code");		
			
		if(firstLine == true)  // this is the first line of the code-block
		{
			// create a [div] for the code-block and give it class "codeBlock"
			codeBlockDiv = document.createElement("div");
			codeBlockDiv.classList.add("codeBlock");
			
			// when clicked, call the selectText function and pass the element
			codeBlockDiv.ondblclick = function(){ selectText(this) };
			
			addrLines[i].parentElement.insertBefore(codeBlockDiv, addrLines[i]);
			
			addrLines[i].classList.add("firstLine");	
			firstLine = false;
		}
		// add a space to empty lines for copying/pasting purposes
		if(addrLines[i].innerHTML == "")
		{
			addrLines[i].innerHTML = "&nbsp;";
		}	
		
		// check if the next element is also an [address] -- if not than this is the last line
		if(addrLines[i].nextElementSibling == null || addrLines[i].nextElementSibling.tagName != "ADDRESS")
		{
			addrLines[i].classList.add("lastLine");
			firstLine = true;
		}		
		
		// add the code line to the codeblock 
		codeBlockDiv.appendChild(addrLines[i]);
	}

	/**** this part works if we are using <p> with class="code" -- deprecated 
	var pLines = document.getElementsByTagName("p");

	for(i=0; i<pLines.length; i++)
	{
		if(pLines[i].className=="code" && pLines[i+1].className!="code")
		{
			pLines[i].classList.add("lastLine");
		}
		
	}*/
	
	/**** this part works if we are using <pre> with class="code" -- deprecated 
	var codeSnippets = document.getElementsByTagName("pre");
	
	for(i=0; i<codeSnippets.length; i++)
	{
		// only apply changes in class name is code or there is no class name
		// this allows for the use of [pre] with multiple classes

		if(codeSnippets[i].className == "" || codeSnippets.className == "code")
		{
			numLines = $(codeSnippets[i]).html().split("<br>").length;
			
			var codeText = "";
			for(j=0; j<(numLines); j++)
			{
				codeText += "<code>" + $(codeSnippets[i]).html().split("<br>")[j] + "</code>";
			}
			codeSnippets[i].innerHTML = codeText;	
		}
	}*/
}

function selectText(e)
{
	var range = document.createRange();
	range.selectNode(e);
	window.getSelection().addRange(range);
}

/* takes
<p><img src="ImgSrc"></p>
<p class="caption">Caption text </p>

and converts it to

<figure>
	<img src="ImgSrc">
	<figCaption">Caption text </figCaption>
</figure>
*/
function captionImages()
{
	// get all the images in the page (can later expand to tables, code-blocks...)
	var imagesInPage = document.getElementsByTagName("img");
	
	// if the next element is designated a caption
	var captionsInPage = document.getElementsByClassName("caption");
	
	/* works if image is inside a <p>, does not if it is in a larger <div>
	   need to do something like:  append next, append before */
	for(i=0; i<imagesInPage.length; i++)
	{	
		// check first for a nextSiblingElement and if that sibling has class="caption"
		if(imagesInPage[i].parentElement.nextElementSibling &&
			imagesInPage[i].parentElement.nextElementSibling.classList.contains("caption"))
		{
			imageParent = imagesInPage[i].parentElement			// get the parent element of the image
			captionElement = imageParent.nextElementSibling;	// get the caption next to the parent
			
			figure = document.createElement("figure");			// create a [figure] element
			figCaption = document.createElement("figCaption");	// create a [figcaption] element
			figCaption.innerHTML = captionElement.innerHTML;	// copy caption in [figcaption] element
			figCaption.classList.add("caption");					// add caption class to [figCaption]
			figure.appendChild(imagesInPage[i]);					// add image to [figure]
			figure.appendChild(figCaption);							// add [figcaption] to [figure]
			
			// remove the original caption
			captionElement.parentElement.removeChild(captionElement);
			
			// add figure to parent of image
			imageParent.appendChild(figure);
		}
		
		// then check if the image has a title -- this will be deprecated
		else if(imagesInPage[i].title.trim() != "")
		{
			figureImg = document.createElement("figure");
			imageParent = imagesInPage[i].parentNode;
			imageParent.insertBefore(figureImg, imagesInPage[i]);
			figureCaption = document.createElement("figcaption");
			figureCaption.innerHTML = "Fig. " + (i+1) + ": " + imagesInPage[i].title;		
			figureImg.appendChild(imagesInPage[i]);
			figureImg.appendChild(figureCaption);
		}
	}
}

function rightClickMenu(funct, param = null)
{
	if (navigator.userAgent.indexOf("Firefox") != -1)
	{
		document.body.setAttribute("contextmenu", "rightClickMenu");

		contextMenu = document.createElement("menu");
		contextMenu.type = "context";
		contextMenu.id = "rightClickMenu";

		menuItem = document.createElement("menuitem");
		menuItem.label = "Print";
		menuItem.onclick = function(){ window.print() };

		contextMenu.appendChild(menuItem);

		menuItem = document.createElement("menuitem");
		menuItem.label = "Maximize All Pictures...";
		menuItem.onclick = function(){ changeAllPicSize('maximize') };

		contextMenu.appendChild(menuItem);

		menuItem = document.createElement("menuitem");
		menuItem.label = "Minimize All Pictures...";
		menuItem.onclick = function(){ changeAllPicSize('minimize') };

		contextMenu.appendChild(menuItem);

		menuItem = document.createElement("menuitem");
		menuItem.label = "Edit Page";
		menuItem.onclick = function(){  
				oldURL = String(window.parent.location);  // otherwise you will edit the URL
				newURL = oldURL.replace("viewContent", "contentFile"); 
				newURL = newURL.replace("View", "EditFile?fm=0"); 
				window.open(newURL, "_blank")
		};		
		contextMenu.appendChild(menuItem);
				
		document.body.appendChild(contextMenu);
	}
	else
	{
		if(funct == "create")
		{
			var elemDiv = document.createElement('div');
			elemDiv.id = "rightClickDiv";
			elemDiv.classList.add("menu");

			var menuItem7 = document.createElement('a');	
			menuItem7.href = "javascript:copySelectedText()"
			menuItem7.innerHTML = "Copy Selected Text";
			menuItem7.style.display = "block";
			elemDiv.appendChild(menuItem7);
			
			var menuItem8 = document.createElement('a');	
			menuItem8.href = "javascript:window.print()"
			menuItem8.innerHTML = "Print/ Save as PDF";
			menuItem8.style.display = "block";
			elemDiv.appendChild(menuItem8);
			
			var menuItem4 = document.createElement('a');	
			oldURL = String(window.parent.location);  // otherwise you will edit the URL
			newURL = oldURL.replace("viewContent", "contentFile"); 
			newURL = newURL.replace("View", "EditFile?fm=0"); 
			menuItem4.href = newURL; //newURL;
			menuItem4.target = "_parent";
			menuItem4.innerHTML = "Edit Page";
			menuItem4.style.display = "block";
			elemDiv.appendChild(menuItem4);
			
			var menuItem5 = document.createElement('a');	
			menuItem5.href = "javascript:changeAllPicSize('maximize')"
			menuItem5.innerHTML = "Maximize all pictures"
			menuItem5.style.display = "block";
			elemDiv.appendChild(menuItem5);
			
			var menuItem6 = document.createElement('a');	
			menuItem6.href = "javascript:changeAllPicSize('minimize')"
			menuItem6.innerHTML = "Minimize all pictures"
			menuItem6.style.display = "block";
			elemDiv.appendChild(menuItem6);
			
			document.body.appendChild(elemDiv);
			
			document.body.oncontextmenu=function(event)
			{
				rightClickMenu('show', event); return false;
			}
			document.body.onclick=function()
			{
				rightClickMenu('hide');
			}
		}
		else if(funct == "show")
		{
			document.getElementById("rightClickDiv").style.display = "block"; 
			document.getElementById("rightClickDiv").style.top = param.clientY + "px"; 
			document.getElementById("rightClickDiv").style.left = param.clientX + "px";			
		}
		else if(funct == "color")
		{
			document.body.style.backgroundColor = param;
			funct = "hide";
		}
		if(funct == "hide")
		{
			document.getElementById("rightClickDiv").style.display = "none"; 	
		}
	}
}

function copySelectedText()
{
	var text = "";
	if (window.getSelection) 
	{
		// works in all browsers except Firefox (current bug as of version 51)
		text = window.getSelection().toString();
		a = document.execCommand("copy");	
	} 
}

function addDownloadLinks()
{
	downloadLinks = document.getElementsByClassName("download");

	for(i=0; i<downloadLinks.length; i++)
	{
		downloadLinks[i].download = "";
	}
}
/* Things to do
- check if there is content in the source file <done>
- create the divs in destination <done>
- check if div already exists in destination <done>
- allow user to control which sections get copied 
  - ALL, ALL_BUT_LINKS, CONTENT_ONLY, 
- create a mapping of section types to numbers (instead of using div1, div2...)
*/