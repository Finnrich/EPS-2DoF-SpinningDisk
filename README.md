# 2dof Spinning Disk
_by [Feet](https://feet.upv.es) (Group Sergio in the [EPS](https://europeanprojectsemester.eu) 2024 at [UPV](https://www.upv.es))_

This project is hosted on [feet.upv.es](https://feet.upv.es) (Interface at [feet.upv.es/2dof/](https://feet.upv.es/2dof/)).

## Purpose
This provides an interface for the test bench platform 2dof-Spinning-Disk.  
The user is able to send configurations to the device. Additionally, the point is to visualize the performance of the user with diagrams. The performance evaluation can be uploaded to a database to create a gamified competition between the students. This is only possible if the students have a session-id which can only be created by a teacher. The results can be filtered by disk-code as different disk tracks might be used.

## Project structure

The project consists of a frontend and backend. Additionally, it uses WordPress for user management and its SQL database.

![Sites diagram](./SitesDiagram.png)

Each part is explained further in its folder's README.

### File structure on server

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