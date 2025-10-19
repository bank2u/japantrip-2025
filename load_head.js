(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'head.html', false); // synchronous request
    xhr.send(null);
    if (xhr.status === 200) {
        document.write(xhr.responseText);
    }
})();