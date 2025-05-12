git merge ....
git push origin main
git pull 

| Command             | Purpose                         |
| ------------------- | ------------------------------- |
| `git status`        | Show modified/untracked files   |
| `git add <file>`    | Stage a file for commit         |
| `git add .`         | Stage **all** changed files     |
| `git reset <file>`  | Unstage a file (undo `git add`) |
| `git diff`          | Show unstaged changes           |
| `git diff --staged` | Show staged changes             |


| Command                         | Purpose                              |
| ------------------------------- | ------------------------------------ |
| `git commit -m "Your message"`  | Commit staged changes with a message |
| `git commit -am "Your message"` | Add **and** commit tracked files     |
| `git log`                       | View commit history                  |
| `git log --oneline`             | Condensed view of history            |



| Command                  | Purpose                             |
| ------------------------ | ----------------------------------- |
| `git branch`             | List all branches                   |
| `git branch <name>`      | Create a new branch                 |
| `git checkout <name>`    | Switch to a branch                  |
| `git checkout -b <name>` | Create **and** switch to new branch |
| `git merge <branch>`     | Merge a branch into the current one |
| `git branch -d <branch>` | Delete a branch                     |



| Command                       | Purpose                          |
| ----------------------------- | -------------------------------- |
| `git remote -v`               | Show remotes (like `origin`)     |
| `git push`                    | Push local changes to remote     |
| `git push -u origin <branch>` | Push and track upstream branch   |
| `git pull`                    | Pull changes from remote         |
| `git fetch`                   | Download changes but don't merge |


| Command                  | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `git checkout -- <file>` | Discard changes in file                      |
| `git restore <file>`     | Same as above (modern)                       |
| `git reset --hard`       | Reset all changes (use with caution)         |
| `git revert <commit>`    | Undo a commit **safely** (creates a new one) |


| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `git stash`      | Save uncommitted changes temporarily |
| `git stash pop`  | Reapply stashed changes              |
| `git tag`        | List tags (used for releases)        |
| `git tag <name>` | Create a new tag                     |
