window.addEventListener('load', function() {
    getBlogs()
    var btn = document.getElementById( 'submit' )
    btn.addEventListener( 'click', search )

    var createBtn = document.getElementById( 'create' )
    createBtn.addEventListener( 'click', function(){
        window.location.href = `create.html`
    })

});

function search(){
    var value = document.getElementById( 'search' ).value
    getBlogs( value )
}

async function getBlogs( query ) {
    if( !query ) {
        return fetch( 'https://masai-blog.herokuapp.com/blogs?_sort=created_date&_order=desc' )
        .then( res => res.json() )
        .then( res => displayBlogs( res ) )
        .catch( err => alert( err ) )
    } 

        return await fetch( 'https://masai-blog.herokuapp.com/blogs?q='+query )
        .then( res => res.json() )
        .then( res => displayBlogs( res ) )
        .catch( err => alert( err ) )

}

//displaying all the latest blogs
async function displayBlogs( res ){
    var div = document.getElementById( 'res' )
    div.textContent = ""
    for( let i = res.length-1; i >= 0; i-- ) {
        var cont = document.createElement( 'div' )
        cont.setAttribute( 'class', 'displayCont')


        var para = document.createElement( 'p' )
        para.setAttribute( 'class', 'displayId')
        para.textContent = `#${res[i].id}:`

        var midDiv = document.createElement( 'div' )
        midDiv.setAttribute( 'class', 'midDivCont' )

        var title = document.createElement( 'h3' )
        title.setAttribute( 'class', 'displayTitle' )
        title.textContent = `${para.textContent}${res[i].title}`

        var author = document.createElement( 'p' )
        author.setAttribute( 'class', 'displayAuthor' )
        author.textContent = `> ${res[i].author}`

        var createdDate = document.createElement( 'p' )
        createdDate.setAttribute( 'class', 'displayCreatedDate' )
        createdDate.textContent = `Created Date: ${res[i].created_date}`

        var category = document.createElement( 'p' )
        category.setAttribute( 'class', 'displayCategory' )
        category.textContent = `Category: ${res[i].category}`

        var tags = document.createElement( 'p' )
        tags.setAttribute( 'class', 'displayTags' )
        tags.textContent = `Tags: ${res[i].tags}`

        var para2 = document.createElement( 'p' )
        para2.setAttribute( 'class', 'displayCommentCount')
        await fetch( 'https://masai-blog.herokuapp.com/comments?blog_id='+res[i].id)
        .then( result => result.json() )
        .then( result => {
            para2.textContent = `No of Comments: ${result.length}`
        } )

        var editBtn = document.createElement( 'button' )
        editBtn.setAttribute( 'class', 'editBtn' )
        editBtn.setAttribute( 'value', res[i].id )
        editBtn.textContent = 'EDIT'
        editBtn.addEventListener( 'click', edit )

        var deleteBtn = document.createElement( 'button' )
        deleteBtn.setAttribute( 'class', 'deleteBtn' )
        deleteBtn.setAttribute( 'value', res[i].id )
        deleteBtn.textContent = 'DELETE'
        deleteBtn.addEventListener( 'click', deleteIt )

        var viewBtn = document.createElement( 'button' )
        viewBtn.setAttribute( 'class', 'viewBtn' )
        viewBtn.setAttribute( 'value', res[i].id )
        viewBtn.textContent = 'VIEW'
        viewBtn.addEventListener( 'click', showBlog )        

        var btnDiv = document.createElement( 'div' )
        btnDiv.setAttribute( 'class', 'btnDiv' )

        btnDiv.append( editBtn, deleteBtn, viewBtn )
        midDiv.append( title, createdDate, category, tags, para2, author )
        cont.append( midDiv, btnDiv )
        div.append( cont )

    } 
}

function edit(){
    const id = event.target.value
    window.location.href = `edit.html?q=${id}`
}

// deleting a particular blog
async function deleteIt(){
    const id = Number(event.target.value)
     await fetch ( 'https://masai-blog.herokuapp.com/blogs/'+ id,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then( res => res.json() )
        .then( res => {
         fetch( 'https://masai-blog.herokuapp.com/comments?blog_id='+id )
         .then( res => res.json() )
         .then( res => {
                console.log( res )
                for( let i = 0; i < res.length; i++ ){
                         fetch ( 'https://masai-blog.herokuapp.com/comments/'+ res[i].id, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then( res => res.json() )
                        .then( res => console.log( res ) )
                }

         } )
            alert( `Successfully Deleted` ) 
            window.location.reload();
        })
}

async function showBlog(){
    var idData;
    const id = Number( event.target.value )
    console.log( id )
 await fetch ( 'https://masai-blog.herokuapp.com/blogs/'+ id)
    .then( res => res.json() )
    .then( res => idData = res )
    .then( res => renderBlog( idData ) )
    getComments( id )
    commentTrigger( id )

}


function renderBlog( idData ){
    console.log( idData )
    var div = document.getElementById( 'show-blog' )
    div.innerHTML = ""
    document.querySelector('.overlay').style.display = "flex"
    
    var div1 = document.createElement( 'div' )
    div1.setAttribute( 'class', 'div1' )
    
    var div2 = document.createElement( 'div' )
    div2.setAttribute( 'class', 'div2' )
    
    var div3 = document.createElement( 'div' )
    div3.setAttribute( 'class', 'div3' )


    console.log( idData )
    var title = document.createElement( 'h2' )
    title.setAttribute( "class", "view-title")
    title.textContent = idData.title
    console.log( title )
    
    var author = document.createElement( 'h3' )
    author.textContent = `By:${idData.author}`
    console.log( author )

    div1.append( title, author )

    var body = document.createElement( 'h4' )
    body.textContent = idData.body
    console.log( body )

    div2.append( body )

    var category = document.createElement( 'h3' )
    category.textContent = `Category: ${idData.category}`
    console.log( category )

    var tags = document.createElement( 'h3' )
    tags.textContent = `Tag :${idData.tags}`
    console.log( tags )

    div3.append( category, tags)

    div.append( div1, div2, div3 )

}

async function getComments( id ){
    var data;
    return await fetch ( 'https://masai-blog.herokuapp.com/comments?blog_id='+ id)
    .then( res => res.json() )
    .then( res =>  renderComments(res) )
}

function renderComments( data ) {
    console.log( data )
    var div = document.getElementById( 'show-comments' )
    div.innerHTML = ""
    document.querySelector('.overlay').style.display = "flex"

    for( var i = 0; i < data.length; i++ ){

        var dummy = document.createElement('div')
        dummy.style.border = "1px solid white"
        dummy.style.padding = "5px"

        var commentBody = document.createElement( 'h3' )
        commentBody.textContent = `Comment: ${data[i].body}`;
        var commentAuthor = document.createElement( 'h3' )
        commentAuthor.textContent = `By- ${data[i].author}`;

        dummy.append(  commentBody, commentAuthor )
        div.append( dummy )

    }
}

function commentTrigger( id ) {
    var commentDiv = document.getElementById( 'newBtn' )
    commentDiv.innerHTML = ""
    var commentBtn = document.createElement( 'button' )
    commentBtn.setAttribute( 'class', 'commentBtn' )
    commentBtn.setAttribute( 'value', id )
    commentBtn.textContent = 'ADD NEW COMMENT'
    commentDiv.append( commentBtn )
    commentBtn.onclick = () => {
        addNewComment( id )
    }
} 

function addNewComment( id ) {
    var body = document.getElementById( 'newCommentBody').value
    var author = document.getElementById( 'newCommentAuthor').value
    var blog_id = id
    var created_date = new Date().toLocaleString()
    var payload = { body: body, author: author, created_date: created_date, blog_id: blog_id }

    return fetch ( "https://masai-blog.herokuapp.com/comments?blog_id="+id,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( payload )
    })
    .then( res => res.json() )
    .then( res => {
        alert( `Comment Successfully Added` )
        window.location.reload()
    } )
}

var closeBtn = document.querySelector('#closeBtn')
closeBtn.addEventListener( 'click', function(){
    var overlay = document.querySelector( '#popup1' )
    overlay.style.display = "none"
})