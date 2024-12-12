# 2dof WordPress
## Requirements
The WordPress site can host anything with some requirements.

- WordPress table prefix "wpf_"
- Session creation page for teachers
- Teacher role with capabilities: `2dof_access_api`, `2dof_create_sessions`
- Student role with capabilities: `2dof_access_api`

It is recommended that users are able to register an account themselves.  
The teacher role should be assigned to users by an administrator.

## Setup
`2dof_WordPress.zip` contains our WordPress site.  

We use the plugins:  
- **Ultimate Member** for user registration and login
- **User Role Editor** for adding custom capabilities to roles
- **PHP Native Password Hash** for secure password hashing
- **Carousel Slider Block** for the "Our Values" card carousel on the [Feet page](https://feet.upv.es)

If you want to create your own custom WordPress site, the easiest way is to copy our site and remove/rewrite the Feet pages. Or make sure your page meets the requirements mentioned above.

`sessions_creation_page_snippet.html` contains everything necessary for the session creation page. Create a "Custom HTML" block on your WordPress page and paste the content of `sessions_creation_page_snippet.html` into it.