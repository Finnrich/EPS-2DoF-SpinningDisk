# 2dof Spinning Disk
_by [Feet](https://feet.upv.es) (Group Sergio in the [EPS](https://europeanprojectsemester.eu) 2024 at [UPV](https://www.upv.es))_

This project is hosted on [feet.upv.es](https://feet.upv.es) (Interface at [feet.upv.es/2dof/](https://feet.upv.es/2dof/)).

The project consists of a frontend and backend. Additionally, it uses WordPress for user management and its SQL database.

![Sites diagram](./SitesDiagram.png)

Each part is explained further in its folder's README.

## File structure on server

- **/**
    - _[ All WordPress files ]_
    - **2dof/**
        - .htaccess
        - index.html
        - bundle.js
        - style.css
        - **api/v1/**
            - disks.php
            - is_logged_in.php
            - load_wp.php
            - login.php
            - runs.php
            - sessions.php