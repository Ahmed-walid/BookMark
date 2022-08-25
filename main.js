
bookmarks = []
displayed = []
btns = []

window.onload = setup;

function setup() {

    // to prevent loading after clicking buttons
    btns = document.getElementsByClassName("btn");
    for (i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function (event) { event.preventDefault(); });
    }

    // load bookmarks from local storage
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

    if (bookmarks)
        showCards();
    else
        bookmarks = []

    hideErrors();
    clearFields();

}

function isDisplayed(bookmark) {

    for (i = 0; i < displayed.length; i++)
        if (displayed[i] == bookmark)
            return true;

    return false;
}

function showCards() {

    for (i = 0; i < bookmarks.length; i++) {
        if (!isDisplayed(bookmarks[i])) {
            createCard(bookmarks[i]);
            displayed.push(bookmarks[i]);
        }
    }
}

function findIndexByName(name, arr) {

    for (i = 0; i < arr.length; i++)
        if (arr[i].name == name)
            return i;

    return -1;
}

function deleteBookMark(ele) {

    let buttonName = ele.id;
    let bookmarkname = buttonName.slice(0,buttonName.length - 8);    // to remove "-del-btn" in the button id and get the bookmark id
    console.log("the deleted bookmark name",bookmarkname);
    let bookmarksPos = findIndexByName(bookmarkname, bookmarks);
    let displayedPos = findIndexByName(bookmarkname, displayed);
    console.log(bookmarksPos, displayedPos);
    if (bookmarksPos != -1)
        bookmarks.splice(bookmarksPos, 1);
    if (displayedPos != -1)
        displayed.splice(displayedPos, 1);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    const node = document.getElementById(bookmarkname);
    node.parentNode.removeChild(node);

    showCards();
}

function submitBookMark() {

    let newName = document.getElementById("site-name-input").value;
    let newUrl = document.getElementById("site-url-input").value;

    newName = validateName(newName);
    newUrl = validateUrl(newUrl);

    console.log("newName: ", newName)
    console.log("newUrl: ", newUrl)

    if (newName == null || newUrl == null) {
        console.log("error")
        showErrors(!newName, !newUrl);
        return;
    }

    var newBookMark = { name: newName, url: newUrl };

    // check if exists:
    if(findIndexByName(newBookMark.name, bookmarks) != -1){
        console.log("Already Exists")
        return;
    }

    bookmarks.push(newBookMark);
    createCard(newBookMark);
    displayed.push(newBookMark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    hideErrors();
    clearFields();

}

function showErrors(nameErr, urlErr) {
    if (nameErr) {
        let namealert = document.getElementById("name-alert");
        namealert.style.display = 'block';
        namealert.innerHTML = "Invalid Name"
    }
    if (urlErr) {
        let urlalert = document.getElementById("url-alert");
        urlalert.style.display = 'block';
        urlalert.innerHTML = "Invalid Url"
    }
}

function hideErrors() {
    let namealert = document.getElementById("name-alert");
    namealert.style.display = 'none';
    let urlalert = document.getElementById("url-alert");
    urlalert.style.display = 'none';
}

function clearFields() {
    document.getElementById("site-name-input").value = "";
    document.getElementById("site-url-input").value = "";
}

function validateName(name) {
    if (name == null || name.length == 0)
        return null;

    let remText = name.replace(/ /g, "");
    if (remText.length == 0)
        return null;

    name = name.trim();

    return name;
}

function validateUrl(url) {

    if (url == null || url.length == 0)
        return null;

    url = url.trim();
    if (url.includes(" "))
        return null;

    if (url.includes("https://") == false && url.includes("http://") == false)
        return null;

    return url;
}

function createCard(bookmark) {

    let bookmarksDiv = document.getElementById("bookmarks");
    bookmarksDiv.innerHTML += "<div class=\"card\" id=\"" + bookmark.name + "\"></div>"
    let cardDiv = document.getElementById(bookmark.name);
    let title = "<h2>" + bookmark.name + "</h2>";
    let visBtn = "<a target=\"_blank\"  href=\"" + bookmark.url + "\"><div class=\"two-buttons\"><button  class=\"btn visit\">Visit</button></a>";
    let delBtn = "<button id=\"" + bookmark.name+"-del-btn"+ "\" class=\"btn delete\" onclick=\"deleteBookMark(this)\">Delete</button></div>";
    cardDiv.innerHTML += title + visBtn + delBtn;

}
