let searchBar = document.querySelector("#home-search-bar") || document.querySelector("#result-search-bar");
let keywordLists = document.querySelector("#home-keyword-list") || document.querySelector("#result-keyword-list");

function itemClick(element) {
    console.log(element);
    searchBar.value = element.innerText;
    searchBar.focus();
}

function getKeywords(event){
    var formData = new FormData();
    formData.append("q", event.value);
    if (event.value) {
        fetch("keywords", {
            method: "POST",
            body: formData
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length) {
                keywordLists.hidden = false;
            }
            data.forEach(keyword => {
                keywordLists.innerHTML = `<p class="keyword-item" onclick="itemClick(this)">${keyword}</p>`;
            });
        });
    } else {
        keywordLists.innerHTML = "";
        keywordLists.hidden = true;
    }
}