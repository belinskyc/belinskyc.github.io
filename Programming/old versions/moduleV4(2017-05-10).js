/* Recent Fixes (April 2017)
- Use titles in codeLines as line numbers
- MAC color scheme direction added
- iframe can access parent window (and control it)
- href="#" switched to onclick="scrollTo..."
- iframe in D2L resizes vertically when material changes vertical size
- figure references that are blank are ignored
- when you copy/paste a block of code from the website, D2L will include the generated <div id="codeBlock">
  causing lots of formatting issues
  Solution: remove all div from the webpage initially and copy the content of the div to the same location
- when you copy/paste a block of code from the website, D2L will include the generated class <h6 class="codeBlock firstLine">

Still needed :
- formula do not work in sandbox in Chrome (work in FireFox)
- pagemap for all browsers
- right-click not working -- working (changed function name)
- click-out issue -- gone away??
- print full sized picture (Firefox only) -- seems to only be a Firefox/our HP printer issue
- changing links to pics/files that get renamed
- switch all figure links to titles instead on fig-[id] -- working, not fully switched
- create a console log ***
- have jumplinks use title instead of link-[id] -- working, not fully switched

*/

/* Issues:
- An image without a caption will not be put inside a [figure]
  -- not sure this is the way it should be...
  
- some pages in D2L end with: ?ou=457124 (where 457124 is the class number)-- this is redundant info and 
  causes problem when clicking to edit to page.  
  - have right-click split the url at the "?"
  
- page now looks for itself in an iframe to find its offset in the parent page

- can now handle if we are in an iframe (D2L) or not 
  - MUCH better for sandboxing code

- code was only fixing the first script set that used [br] 
  - issue: number of codelines changes when the first was fixed -- needed to update for loop to reflect that.
  
- you can make a relative link to the file for a class but not the content.  
	The difference is that, when you link the file, the file will load in the 
	iframe but the rest of the page will still reflect the original content.  
	So, hyperlinks to the content will break if taken out of context.

- hideEmptyTables needs to check both the primary and secondary pages for content -- 
	right now it is just checking primary (I think - not tested)

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

- If you try to include this JavaScript file in D2L using the correct relative link: 
   ../../Programming/module.js
	D2L will modify the link to the incorrect absolute link:
	https://d2l.msu.edu/content/DEVELOPMENT/2016/courses/DEV-belinsky-2016-TestRClass/R/Lessons/../../../../Programming/module.js
	
	To make it work in D2L with sa relative link you would need to use: Programming/module.js
	but, this is an incorrect relative link and would not work outside of D2L
	
	To fix the issue, I put JavaScript code that adds a JavaScript file in the <head> of all lessons
	<script>
		var scriptFile = document.createElement('script');
		scriptFile.src = "../../Programming/module.js";
		document.getElementsByTagName('head')[0].appendChild(scriptFile);
	</script>
*/
smallImageHeight = 100;			// set the height of flex-sized images when small 
imageHeight = new Array();		// the heights of all flex-sized images in a page
imageWidth = new Array();		// the widths of all flex-sized images in a page
minImageWidth = 700;				// minimum width for a flexSize image in expanded mode
scrollTopPosition = 0; 			// value saved for links-return-links within a page
returnLink = null;				// element on page that contains the return link

addStyleSheet();  // can be done before page load since this is called in the [head]

// resize the iframe in the parent window when the page gets resized
window.parent.addEventListener("resize", function()
{
	// get all iframe in the parent page
	parentIFrames = window.parent.document.getElementsByTagName("iframe");

	// default value if the iframe is not found (this is for debugging only)
	iframeOffset = 0; 

	// go through iframes to find which has the same source as this page (i.e., it holds this page)
	for(i=0; i<parentIFrames.length; i++)
	{
		// this is the iframe that conatins the page
		if (window.location.href == parentIFrames[i].src) 
		{
			// get the offset of this iFrame in the parent window
			parentIFrames[i].style.height = parentIFrames[i].scrollHeight; 
			// refreshes page -- need a better way to do this
			document.body.innerHTML += " ";  
			break;  // don't need to check anymore iframes
		}
	}
});

window.onload = function()
{		
	// set title on webpage
	window.document.title = document.getElementById("title").textContent;
	
	// there should be no [div] elements in the page -- [div] can be copied/pasted in
	removeDivs();
	
	// a link used everytime the person jumps in the page to return them to the original spot
	createReturnLink(); 
	
	// allow users to resize images from small to full-size
	createFlexImages();
	
	/* editModeStyles(); -- was trying to hide object in editor but D2L editor does not look at JavaScript */
	/* hideEmptyTables(); -- hide empty elements on the page -- not needed with new template */
	
	// adds the caption class to all H5 elements
	addCaption("H5")
	
	// associate captions and images using accessibility standards 
	captionImages();
	
	// find all references to figures in the webpage and add correct figure number
	figureReferences();
	
	// structure the page with DIVs based on the headers 
	addDivs("H1");
	addDivs("H2");
	addDivs("H3");
	
	// Create a right-click menu
	makeContextMenu("create");  // needs to happen after divs are created
	
	// convert class="linkTo" to an anchor link -- D2L does not allow you to make links using a hash tag (#)
	/*addAnchorLink(); --deprecated -- all functionality is now in createInPageLinks() */
	
	// set up onclick functionality for "anchor" links (needed because page exists in an iframe)
	createInPageLinks();
	
	// adds code tags to all content within an [h6] tag
	// need to add the divs before doing the code tags becuase this includes the div codeblocks
	addCodeTags("H6");

	// convert "download" class to a download hyperlink (because D2L does not allow you to specify this trait)
	addDownloadLinks();	
}

/* removes all of the [div] elements in the page and move the content inside the [div]
   up one level */
function removeDivs()
{
	divElements = document.getElementsByTagName("DIV");

	// the [div] length changes as [div] are removed -- we need to hold the initial number of [div]
	initNumOfDivs = divElements.length;
	
	for(i=0; i<initNumOfDivs; i++)
	{
		/* Since we are always removing the previous [div], we are always dealing with the first [div]
			of the remaining [div], hence [0] is always used (unintuitive, I know -- its JavaScript) */
			
		// get information inside the div and save it to a temp variable
		divContent = divElements[0].innerHTML
		
		// copy the content of the [div] before the [div] 
		divElements[0].insertAdjacentHTML("beforebegin", divContent);
		
		// remove the [div]
		divElements[0].parentElement.removeChild(divElements[0]);
	}
}

/* Whenever an in-page jump is made, a return link will appear in the
	element that returns you to the previous positioin */
function createReturnLink()
{
	// create a return link to the position in page the user was at before making the jump
	returnLink = document.createElement("a");
	returnLink.innerHTML += "Go back to previous location";
	returnLink.href = "";
	returnLink.id = "returnLink";
	returnLink.className = "linkback";
	returnLink.style.display = "none";
	returnLink.onclick = function()
	{
		goBackToPrevLocation();
		return false;		// stops the page from reloading -- unsure why!
	}
}
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

/* uses the header structure of the page to create a visual style with div elements --
	user passes in the elementType they want to structure (H1, H2, and H3 are currently supported */ 
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
					
		// get title from element -- tranfer to new div
		if(elements[i].title != "")
		{
			newDiv.title = elements[i].title
		}
		else  // no title -- use text from header
		{
			newDiv.title = elements[i].innerText;
		}
		
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

/* Finds all elements with class "linkTo" and adds a pseudo-anchor link--
Two issues here
1) D2L does not allow the user to use an anchor link as a hyperlink hence the workaround
using classes 
2) page exists in an iframe -- hence we need to scroll to the anchor as opposed to linking to it
*/ 
function createInPageLinks()
{
	linkElements = document.getElementsByClassName("linkTo");
	
	/*
		Essentially we are going 
			from		
		<p class="linkTo" id="link-to-here"> I am the content </p>
			to
		<p class="linkTo" id="link-to-here"> <a href="#to-here"> I am the content </a> </p>
		
		actually want
		<p class="linkTo" id="link-to-here" onclick="scrollHere()"> I am the content </p>
		
	}*/
	for(i=0; i<linkElements.length; i++)	
	{
		// get id of figure you are refering to (this.id - "fig-")
		if(linkElements[i].title == "")
		{	
			linkToId = linkElements[i].id.slice(5);  // this line remove the "link-" part of the id (which is 5 characters)
		}
		else
		{
			linkToId = linkElements[i].title;
		}
		
		// find the element to link to
		linkToElement = document.getElementById(linkToId);
	
		if(linkToElement) // if there is an element to link to
		{
			// go to scrollToElement() function when the anchor is clicked
			linkElements[i].onclick = scrollToElement(linkToElement.id);
		}
		else  // there is no element -- add a warning to the onscreen text
		{
			linkElements[i].innerText += " ***Link does not exist***"
		}
	}
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

function addCaption(elementType)
{
	// find all elements of elementType (initially it is H5)
	var captionLines = document.getElementsByTagName(elementType);
	
	for(i=0; i<captionLines.length; i++)
	{
		captionLines[i].classList.add("caption");	
	}
}

/* add the tag: [code] to each line inside a [pre] block --
  thw real trick is that there are multiple ways in which D2L will code a set of lines*/
function addCodeTags(elementType)
{
	/* this part works if we are using <h6> with class="code" */
	var codeLines = document.getElementsByTagName(elementType);

	/* count the number of address/H6 tags
	   note: if you use codeLines.length in the for loop, the length will change
		as you add [address] tags -- creating an infinite loop */
	numCodeTags = codeLines.length;
	
	// first go through [address/H6] elements and check for [br] tag -- switch to [address/H6]
	for(i=0; i<numCodeTags; i++)
	{
		// need to be very careful in for loops where the counted element is changing
		codeElement = codeLines[i];
				
		/* fix the situation where code lines are broken up by [br] --
			usually happens when code was copied/pasted into editor */
		if(codeLines[i].getElementsByTagName("br").length > 0)
		{ 
			// count how many lines of code there are: number of <br> + 1
			numLines = codeLines[i].getElementsByTagName("br").length +1; // no break on last line

			var codeText = new Array();
			for(j=0; j<numLines; j++)
			{
				// copy all the lines of code into an array
				codeText[j] = codeLines[i].innerHTML.split("<br>")[j];
			}
			for(j=0; j<numLines; j++)
			{
				newElement = document.createElement(elementType);  // create an [address/H6] 
				newElement.innerHTML = codeText[j];						// insert line of code into [address/H6]
				if(j == 0)
				{
					newElement.title = codeLines[i].title;				// transfer title information to only the first element
				}
				// add the new code line  
				codeElement.parentElement.insertBefore(newElement, codeElement);  
			}
			// remove the original code 
			codeElement.parentElement.removeChild(codeElement);	
			
			/********
			the number of code tags increased -- so codeLines[] has been updated to match
			*********/
			numCodeTags = codeLines.length;  // increase numCodeTags to the current codeline length
			i = i + numLines -1; // increase i by the number of codelines just added (don't need to check those)
		}
	}

	firstLine = true;
	// now, go through all [address/H6] including new one generated from above
	for(i=0; i<codeLines.length; i++)
	{
		// add "code" class to line
		codeLines[i].classList.add("code");		
			
		/* when code is copied and pasted, the class names can also be copy/pasted --
			removes erroneous class names */
		if(codeLines[i].classList.contains("firstLine"))
		{
			codeLines[i].classList.remove("firstLine")
		}
		if(codeLines[i].classList.contains("lastLine"))
		{
			codeLines[i].classList.remove("lastLine")
		}			
		
		if(firstLine == true)  // this is the first line of the code-block
		{
			// create a [div] for the code-block and give it class "codeBlock"
			codeBlockDiv = document.createElement("div");
			codeBlockDiv.classList.add("codeBlock");
			
			// when clicked, call the selectText function and pass the element
			codeBlockDiv.ondblclick = function(){ selectText(this) };
			
			// add the codeBock div as a parent to the codeLine
			codeLines[i].parentElement.insertBefore(codeBlockDiv, codeLines[i]);
			
			// make this codeLine the first line
			codeLines[i].classList.add("firstLine");	
			firstLine = false;
		}
		
		// add a space to empty lines for copying/pasting purposes
		if(codeLines[i].innerHTML == "")
		{
			codeLines[i].innerHTML = "&nbsp;";
		}	
			
		// check if the next element after this codeLine is an [address/H6] -- if not than this is the last line
		if(codeLines[i].nextElementSibling == null || codeLines[i].nextElementSibling.tagName != elementType)
		{
			codeLines[i].classList.add("lastLine");
			firstLine = true;
		}		
		
		// check if the codeLine has a line number associated with it -- set the line number to it
		if( codeLines[i].title != "" && !isNaN(codeLines[i].title) )
		{
			codeLines[i].style.counterReset = "codeLines " + (codeLines[i].title -1);
		}
		
		// add the code line to the codeblock */
		codeBlockDiv.appendChild(codeLines[i]);
	}
}

/* Selects all text within the HTML element */
function selectText(element)
{
	var range = document.createRange();
	range.selectNode(element);
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
	
	/* should have this in D2L:
		[p]      <-- parent of image
		  [img]  <-- looking at images
		[/p]
		[p class="caption]	   <-- nextElementSibling of parent with caption
		[/p]
		
		and converting it to this:
		[p]
		   [figure]
		     [img]
			  [figcaption]  <-- old caption with "Fig. #:" appended
		   [/figure]
		[/p]
	*/
	for(i=0; i<imagesInPage.length; i++)
	{	
		// trying to find the paragraph [p] parent of the image --
		// the problem is that there might be [b], [i], or [span] ancestors in the way
		parElement = imagesInPage[i].parentElement;

		while(parElement && parElement.tagName != "P")
		{
			parElement = parElement.parentElement;
		}
		
		/*** Add error onscreen if parent [p] not found?? ***/
		// first make sure that we actally got an element and not end-of-page
		if(parElement)  
		{
			/* need to find a class="caption" element in the next element sibling's descendants
			   again, same issue as before where you should have
			      [p class="caption"] 
					but could have
					[p][span][b][i][span class="caption"]    */
					
			if(parElement.nextElementSibling)  // if there is a next sibling
			{
				capElement = parElement.nextElementSibling;  // go to the next sibling (likely a [p])
			
				while(capElement.childElementCount != 0 && !(capElement.classList.contains("caption")))
				{
					capElement = capElement.childNodes[0];
				}

				/*** Add error onscreen if caption not found?? ***/
				// make sure we found an element with class = "caption"
				if(capElement.classList.contains("caption"))
				{
					figure = document.createElement("figure");			// create a [figure] element
					figCaption = document.createElement("figCaption");	// create a [figcaption] element
					
					// copy caption in [figcaption] element and preprend with the figure number
					figCaption.innerHTML = "Fig. " + (i+1) + ": " + capElement.innerText;	
					figCaption.classList.add("caption");					// add caption class to [figCaption]
					figure.appendChild(imagesInPage[i]);					// add image to [figure]
					figure.appendChild(figCaption);							// add [figcaption] to [figure]
					
					// remove the original caption
					capElement.parentElement.removeChild(capElement);
					
					// add figure to parent of image
					parElement.appendChild(figure);
				}
			}
		}
	}
}

function makeContextMenu(funct, param = null)
{
	// for Firefox 
	if (navigator.userAgent.indexOf("Firefox") != -1)
	{
		// when the user clicks the right button, the rightClickMenu (create in this function) appears
		document.body.setAttribute("contextmenu", "rightClickMenu");

		// creating a right-click context menu
		contextMenu = document.createElement("menu");
		contextMenu.type = "context";
		contextMenu.id = "rightClickMenu";

		// add a Print lesson button to the context menu
		menuItem = document.createElement("menuitem");
		menuItem.label = "Print";
		menuItem.onclick = function(){ window.print() };
		contextMenu.appendChild(menuItem);

		// add a Maximize All (flexSize) Pics button to the context menu
		menuItem = document.createElement("menuitem");
		menuItem.label = "Maximize All Pictures...";
		menuItem.onclick = function(){ changeAllPicSize('maximize') };
		contextMenu.appendChild(menuItem);

		// add a Minimize All (flexSize) Pics button to the context menu
		menuItem = document.createElement("menuitem");
		menuItem.label = "Minimize All Pictures...";
		menuItem.onclick = function(){ changeAllPicSize('minimize') };
		contextMenu.appendChild(menuItem);

		// add an edit page button to the context menu
		menuItem = document.createElement("menuitem");
		menuItem.label = "Edit Page";
		menuItem.onclick = function(){  
				oldURL = String(window.parent.location); 
				newURL = oldURL.split('?')[0];  // get rid of parameters (designated by "?")
				newURL = newURL.replace("viewContent", "contentFile"); // replace viewContent with contentFile
				newURL = newURL.replace("View", "EditFile?fm=0"); 	// replace View with EditFile?fm=0
				window.open(newURL, "_blank")
		};		
		contextMenu.appendChild(menuItem);

		// add an map of the lesson to the context menu
		submenu = document.createElement("menu");
		submenu.label = "Page Map";

			divsInPage = document.getElementsByTagName("div");
			divID = new Array();
			for(i=0; i<divsInPage.length; i++)
			{
				if(divsInPage[i].id == "")
				{
					divsInPage[i].id = "div" + i;
				}
				divID = divsInPage[i].id;		

				mapItem = document.createElement("menuitem");
				mapItem.label = divsInPage[i].title;
				mapItem.onclick = scrollToElement(divID);
				submenu.appendChild(mapItem);								
			}

		contextMenu.appendChild(submenu);

		document.body.appendChild(contextMenu);
	}
	else // for all other browsers -- eventually would like to combine with above code
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
			
			// add an map of the lesson to the context menu
			menuItem7 = document.createElement("a");
			menuItem7.href = "";
			menuItem7.innerHTML = "Page Map";
			menuItem7.style.display = "block";

		/*		divsInPage = document.getElementsByTagName("div");
				divID = new Array();
				mapItem = new Array();
				for(i=0; i<divsInPage.length; i++)
				{
					if(divsInPage[i].id == "")
					{
						divsInPage[i].id = "div" + i;
					}
					divID = divsInPage[i].id;		

					mapItem[i] = document.createElement("a");
					mapItem[i].href = "javascript:scrollToElement(" + divID + ")";					
					mapItem[i].innerHTML = divsInPage[i].title;
					menuItem7.appendChild(mapItem[i]);								
				}*/

			elemDiv.appendChild(menuItem7);
		
			document.body.appendChild(elemDiv);
			
			document.body.oncontextmenu=function(event)
			{
				makeContextMenu('show', event); return false;
			}
			document.body.onclick=function()
			{
				makeContextMenu('hide');
			}
		}
		else if(funct == "show")
		{
			document.getElementById("rightClickDiv").style.display = "block"; 
			document.getElementById("rightClickDiv").style.top = param.pageY + "px"; 
			document.getElementById("rightClickDiv").style.left = param.pageX + "px";			
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

function scrollToElement(elementID)
{
	// this resolves the fact that variables are function scoped in JavaScript
	//   -- not block scoped
	return function() 
	{
		var element = document.getElementById(elementID);
		scrollTopPosition = window.parent.scrollY;  // save the value of the scroll position
		
		if (window.self !== window.top)  // we are in an iframe
		{
			// get iframes from the parent windows:
			parentIFrames = window.parent.document.getElementsByTagName("iframe");
			
			iframeOffset = 0; // default value if the iframe is not found (should be a debug value)
			
			// go through iframe to find which has the same source as this page (i.e., it holds this page)
			for(i=0; i<parentIFrames.length; i++)
			{
				if (window.location.href == parentIFrames[i].src) // this is the iframe that conatins the page
				{
					// get the offset of this iFrame in the parent window
					iframeOffset = parentIFrames[i].offsetTop; 
					break;  // don't need to check anymore iframes
				}
			}

			// get the amount of vertical space the header take -- this is D2L only
			if(window.parent.document.getElementById("d2l_minibar"))
			{
				headerHeight = window.parent.document.getElementById("d2l_minibar").offsetHeight;
			}
			else
			{
				headerHeight = 0;
			}
			
			// calc the vertical position of the linkTo element in the parent page
			totalScrollY = element.offsetTop + iframeOffset - headerHeight
			// scroll the parent to the vertical position of the linkTo element
			window.parent.scrollTo(element.offsetLeft, totalScrollY);		
		}
		else
		{
			// no parent frame - scroll to location of linkTo element
			window.parent.scrollTo(element.offsetLeft, element.offsetTop);
		}

		// check if element is a div, if not, go to it's parent element (which should be a div)
		if(element.tagName != "DIV")
		{
			element = element.parentElement;
		}
		
		// put anchor at end of div that links back to old position 
		element.appendChild(returnLink);
		returnLink.style.display = "block";
	}
}
function copySelectedText()
{
	var text = "";
	if (window.getSelection)   // if there is something selected on the page
	{
		// works in all browsers except Firefox (current bug as of version 51)
		text = window.getSelection().toString();	// convert selected stuff to a string
		a = document.execCommand("copy");			// copy stuff to clipboard
	} 
}

function addDownloadLinks()
{
	downloadLinks = document.getElementsByClassName("download");

	for(i=0; i<downloadLinks.length; i++)
	{
		// add the download property to all objects with class="download"
		downloadLinks[i].download = "";
	}
}

/* finds all figure references in the page and add the correct numerical reference */
function figureReferences()
{
	var figRefInPage = document.getElementsByClassName("figureRef");

	for(i=0; i<figRefInPage.length; i++)
	{
		// get id of figure you are refering to (this.id - "fig-")
		if(figRefInPage[i].title == "")
		{	
			figureID = figRefInPage[i].id.slice(4);  // slice the fig- off the if
		}
		else
		{
			figureID = figRefInPage[i].title;
		}
			
			
		/* if 1) there is text inside this figure ref (it is not blank) 
				2) the element exists and 
				3) this element has a next sibling element and 
				4) the next sibling element is a figCaption	
		   All four conditions are warnings that should be broken up and logged in the console
		*/
		if(figRefInPage[i].innerText.trim() != "" &&
			document.getElementById(figureID) && 
			document.getElementById(figureID).nextElementSibling && 
			document.getElementById(figureID).nextElementSibling.tagName == "FIGCAPTION")
		{
			/* go to caption attached to figure
			[figure]
			   [img]         <-- actual figure
				[figcaption]  <-- caption attached to figure
			[/figure]  */
			
			// get the caption
			caption = document.getElementById(figureID).nextElementSibling.innerText;
			strIndex = caption.indexOf(":");  // find the location of the first semicolon
			
			figRef = caption.slice(0, strIndex); // get "Fig. #"
			
			figRefInPage[i].innerText = figRef;
		}
		// making sure D2L did not add a wayward object with nothing it in 
		// that cannot be seen by the user (need to log this to console)
		else if(figRefInPage[i].innerText.trim() != "")
		{
			figRefInPage[i].innerText = "Missing Fig.";
		}
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