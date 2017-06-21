"use strict";

var sock = 'ws://localhost:8080/echo';
var ws = new WebSocket(sock);

ws.onopen = function(event) {
    console.log(sock);
};
var feed = document.querySelector('div.feed');
var height = document.documentElement.clientHeight;
feed.style.height = height - 50 + "px";

focusLatest();

var textForm = document.querySelector('form.text');
var textInput = document.querySelector('input.text-input');
textForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var text = textForm.elements[0].value;
    var username = localStorage.getItem('username');
    if (!username) {
        username = 'anonymous';
    };
    var msg = JSON.stringify({
        name: username,
        message: text
    });
    ws.send(msg);
    textInput.value = '';
});

ws.onmessage = function(event) {
    var text = JSON.parse(event.data);
    var username = text.name;
    var msg = text.message;

    var table = document.querySelector('table');
    var row = document.createElement('tr');

    var name = document.createElement('td');
    var message = document.createElement('td');
    name.className = 'name';
    message.className = 'message';

    name.append(username);
    row.append(name);
    message.append(msg);
    row.append(message);
    table.append(row);

    var messages = document.querySelector('td.message');
    focusLatest();
};

var nameForm = document.querySelector('form.name');
var nameInput =document.querySelector('input.name-input');
nameForm.addEventListener('submit', function(event) {
    event.preventDefault();
    localStorage.setItem('username', nameForm.elements[0].value);
    nameInput.value = '';
    displayMenu()
});

var fileInput = document.querySelector('input.file-input');
fileInput.addEventListener('change', () => {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        uploadFile(file);
        // if upload file success...
        provideLink(file);

//        if (file.type.match(/image.*/)) {
//            # display in img tags
//        }

    };
}, false);

function uploadFile(file) {
    console.log('uploading file...');
    var formData = new FormData();
    formData.append('uploads[]', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        };
    };
    xhr.send(formData);
};

function provideLink(file) {
    var gallery = document.querySelector('#gallery');
    var link = document.createElement('a');
    var rel = 'uploads/' + file.name;
    link.href = window.location.href + rel;
    link.append(file.name);
    gallery.appendChild(link);
};

var options = document.querySelector('div.options');
function displayMenu() {
    if (!options.style.display || options.style.display == 'none') {
        options.style.display = 'block';
        nameInput.focus();
    } else {
        options.style.display = 'none';
        textInput.focus();
    };
};

function focusLatest() {
    feed.scrollTop = feed.scrollHeight;
};
