var url = new URLSearchParams( window.location.search )
var query = url.get( 'q' )

window.onload = () => {
    var url = new URLSearchParams( window.location.search )
    var query = url.get( 'q' )
    console.log( query )
    handleQuery( Number(query) )

    var form = document.getElementById( 'form' )
    form.addEventListener( 'submit', updateBlog )
}

// editing a particular blog
function updateBlog() {
    event.preventDefault()
    var form = new FormData( event.target)
    var title = form.get("title")
    var body = form.get("body")
    var author = form.get("author")
    var category = form.get("category")
    var tags = form.get("tags")
    var last_modified_data = new Date().toLocaleString()

    var payload = { title: title, body: body, author: author, category: category, tags: tags, last_modified_data: last_modified_data }

    return fetch ( 'https://masai-blog.herokuapp.com/blogs/'+ query,{
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( payload )
    })
    .then( res => {
        alert( `Edited` )
        window.location.assign( 'index.html' )
    } )
    

}

//search a specific blog
async function handleQuery( query ) {
    var idData;
    console.log( query )
    await fetch( 'https://masai-blog.herokuapp.com/blogs?id='+ query )
    .then( res => res.json() )
    .then( res =>{
        console.log( res )
        idData = res 
    }  )
    console.log( idData )
    var title = document.getElementById( 'title' )
    title.value = idData[0].title
    
    var body = document.getElementById( 'body' )
    body.value = idData[0].body

    var author = document.getElementById( 'author' )
    author.value = idData[0].author

    var category = document.getElementById( 'category' )
    category.value = idData[0].category

    var tags = document.getElementById( 'tags' )
    tags.value = idData[0].tags
}