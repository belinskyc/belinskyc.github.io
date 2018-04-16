/* Issues:
- you can make a relative link to the file for a class but not the content.  The difference is 
	that, when you link the file, the file will load in the iframe but the rest of the page 
	will still reflect the original content.  So, hyperlinks to the content will break if taken 
	out of context.
- hideEmptyTables needs to check both the primary and secondary pages for content -- right
	now it is just checking primary (I think - not tested)
- change [pre] in code only if it does not have its own class already
*/
smallImageHeight = 100;
imageHeight = new Array();
imageWidth = new Array();
screenWidth = 850;
scrollTopPosition = 0;
returnLink = null;

addStyleSheet();  // can be done before page load since this is called in the [head]

window.onload = function()
{	
	editModeStyles();
	hideEmptyTables();
	addCodeTags();
	captionImages();
	fixHashTagFF();
	rightClickMenu("create");
	addDivs("H2");
	addDivs("H3");
	
	// set title on webpage
	window.document.title = document.getElementById("p3").textContent;
	
	var flexImage = document.getElementsByClassName("flexSize");

	for(i=0; i<flexImage.length; i++)
	{
		flexImage[i].addEventListener("click", function(){changeSize(this)}, false); 
		// the strange behavior of JS and for loops: passing i in the 
		// 	function would have set i to the final value of the loop
		flexImage[i].myIndex = i;  
		imageHeight[i] = flexImage[i].naturalHeight;
		imageWidth[i] = flexImage[i].naturalWidth;
		
		// set the image to the small size -- want to eventually call the function 
		//   because this code is in the function already
		flexImage[i].style.width = (smallImageHeight/imageHeight[i])*imageWidth[i] + "px";
		flexImage[i].style.height = smallImageHeight + "px";	
	}
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
/*
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
function addDivs(elementType)
{
	elements = document.getElementsByTagName(elementType);
	
	//newDiv = new Array();
	for(i=0; i<elements.length; i++)
	{
		currentElement = elements[i];
		nextSibling = null;
		// create a new div
		newDiv = document.createElement("div");
		
		newDiv.classList.add("contentDiv");
					
		document.body.insertBefore(newDiv, elements[i]);
		
		while(currentElement.nextElementSibling != null &&
				currentElement.nextElementSibling.tagName != "H2" &&
				currentElement.nextElementSibling.tagName != "H3" &&
				currentElement.nextElementSibling.tagName != "DIV")
		{
			nextSibling = currentElement.nextElementSibling;
			newDiv.appendChild(currentElement);
			currentElement = nextSibling;
		}			
		if(elementType == "H2")
		{	
			newDiv.classList.add("h2Div");
		}
		else if(elementType == "H3")
		{	
			newDiv.classList.add("h3Div");
		}		
		if(currentElement.nextElementSibling == null ||
			currentElement.nextElementSibling.tagName == "H2" ||
			currentElement.nextElementSibling.tagName == "DIV")
		{
			newDiv.classList.add("h2NextDiv");
		}
		else if(currentElement.nextElementSibling.tagName == "H3")
		{
			newDiv.classList.add("h3NextDiv");		
		}
		newDiv.appendChild(currentElement);	
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
/* Go through every flexSize object on the page */
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
	leftPos = window.parent.scrollX;  // keep the same left position
	returnLink.style.display = "none";						
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
	// how far iframe is from the top of screen
	var iframeOffset = 120; //$(arrFrames[0].id, window.parent.document).offset();
		
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
					scrollTopPosition = window.parent.scrollY;
					window.parent.scrollTo(offset.left, offset.top + iframeOffset);
					
					// put anchor at end of div that links back to old position
					document.getElementById(name).appendChild(returnLink);
					returnLink.style.display = "block";
				}
				return false;
			});
		}
	});
}

function addStyleSheet()
{
	/* link to external CSS file 
		This is in the javascript because D2L will rewrite links in the HTML file */
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
	/* this part works if we are using <p> with class="code" */
	var pLines = document.getElementsByTagName("p");

	for(i=0; i<pLines.length; i++)
	{
		if(pLines[i].className=="code" && pLines[i+1].className!="code")
		{
			pLines[i].classList.add("lastLine");
		}
		
	}
	
	/* this part works if we are using <addr> with class="code" */
	var addrLines = document.getElementsByTagName("address");

	for(i=0; i<addrLines.length; i++)
	{
		addrLines[i].classList.add("code");
		
		if(addrLines[i].nextElementSibling == null || addrLines[i].nextElementSibling.tagName != "ADDRESS")
		{
			addrLines[i].classList.add("lastLine");
		}
	}
	
	/* this part works if we are using <pre> with class="code" */
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
	}
}

function changeSize(elementID, instruction="none")
{
	imageIndex = elementID.myIndex;
	origHeight = imageHeight[imageIndex];
	origWidth = imageWidth[imageIndex];
	
	if(elementID.style.height == smallImageHeight + "px" && instruction != "minimize")
	{
		// if the width of the picture is smaller than the screen width...
		if(origWidth <= screenWidth)
		{
			// set the picture to its original size
			elementID.style.width = origWidth + "px";
			elementID.style.height = origHeight + "px";
		}
		else  // picture is bigger than screen width
		{
			// set the picture width to the screen with and scale the height
			elementID.style.width = screenWidth + "px";
			elementID.style.height = (screenWidth/origWidth)*origHeight + "px";
		}
	}
	else if (instruction != "maximize")
	{
		elementID.style.width = (smallImageHeight/origHeight)*origWidth + "px";
		elementID.style.height = smallImageHeight + "px";	
	}
}

function captionImages()
{
	var imagesInPage = document.getElementsByTagName("img");
	
	/* works if image is inside a <p>, does not if it is in a larger <div>
	   need to do something like:  append next, append beofre */
	for(i=0; i<imagesInPage.length; i++)
	{	
		if(imagesInPage[i].title.trim() != "")
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
/* Things to do
- check if there is content in the source file <done>
- create the divs in destination <done>
- check if div already exists in destination <done>
- allow user to control which sections get copied 
  - ALL, ALL_BUT_LINKS, CONTENT_ONLY, 
- create a mapping of section types to numbers (instead of using div1, div2...)
*/