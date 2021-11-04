function getKeywords(event){
    var formData = new FormData();
    formData.append("q", event.value);
    fetch("keywords", {
        method: "POST",
        body: formData
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}