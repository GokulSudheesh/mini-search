let file_input = document.querySelector("#file");
let file_label = document.querySelector("#file-label");

file_input.addEventListener('change', function(event){
    let file = this.files;
    if (file) {
        file_label.innerHTML = file[0].name;
    } else {
        file_label.innerHTML = '<i style="color: #ffffff;" class="fas fa-upload"></i> Choose a file';
    }
});