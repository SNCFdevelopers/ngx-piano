## Doing a release

1. First, make sure you are on `develop` and you have the latest changes
    ```shell
    git checkout develop
    git pull
    ```
2. Then, update the changelog by replacing the 'Unreleased' section with the released version. Remove all unused sections. Don't forget to copy and paste the changelog template at the end of the file to the top of the file.
3. Update version in package.json of ngx-piano project (`projects/ngx-piano/package.json`)
4. Commit the changes
    ```shell
    git commit -m "chore: release vX.X.X"
    ```
5. Create a tag
    ```shell
    git tag -a vX.X.X -m "vX.X.X"
    ```
6. Push the changes
    ```shell
    git push --follow-tags
    ```
7. Go to interface
8. Create a merge request from develop to master
9. Merge the merge request if the pipeline has succeeded
10. The package will be released on npm by the CI

🎉 Congrats! You make a release!
