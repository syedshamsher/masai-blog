window.onload = () => {
    var form = document.getElementById("form")
    form.addEventListener( 'submit', createBlog )

}

// creating new blog
function createBlog() {
    event.preventDefault()
    var form = new FormData( event.target)
    var title = form.get("title")
    var body = form.get("body")
    var author = form.get("author")
    var category = form.get("category")
    var tags = form.get("tags")
    var created_date = new Date().toLocaleString()
    var last_modified_data = new Date().toLocaleString()
    var payload = { title: title, body: body, author: author, category: category, tags: tags, created_date: created_date, last_modified_data: last_modified_data }

    return fetch ( "https://masai-blog.herokuapp.com/blogs",{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( payload )
    })
    .then( res => res.json() )
    .then( res => {
        alert( `Blog Successfully Created` )
        window.location.assign( 'index.html' )
    } )
}
