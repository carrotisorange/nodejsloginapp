# nodejsloginapp

04-23-2023
-added the tailwind cdn - show the tailwind site for references
-added the font awesome links for the icons and
-added folder to store images - load static assets
public - styles.css
public - assets - image.png
app.use('/static', express.static(path.join(\_\_dirname, 'public')));

in the header add the link rel href="/static/styles.css"
-show google fonts and copy paste link to the styles.css
-import at the top and at the body
@import

    body{
        'font-family':
    }

app.use('/assets', express.static(path.join(\_\_dirname, 'public/assets')));
url('/static/image.png');

-shared unsplash site high quality images
-customized the login page design
-refactored the design using extends - header, footer html pages - <%=content%>, <%-include('header')-%>
-added the login functionality

    -access the values from the input fields
        -app.use(bodyparser.json());
        -app.use(bodyparser.urlencoded({extended:true}));

add the session-express
    -app.use(session({
        secret:secret, uuid here
        resave: false,
        saveUnitialized: true
    }));

add the uuid package to generated uuid for the session-express
    -const {v4:uuidv4} = require('uuid');

fake credentials:
    const credential = {
        email:"admin@gmail.com",
        password: 'admin123'
    }

routes
 if(req.body.email === credentials.email && req.body.password === credentials.password)
    req.session.user = req.body.email;
    res.redirect('/dashboard');
 else
    res.end('Invalid username');

 -add encryption to passwords
