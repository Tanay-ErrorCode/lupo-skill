## Contributing to Lupo Skill

Thank you for considering contributing to Lupo Skill. We appreciate your interest in improving our platform. To ensure smooth collaboration, please follow these guidelines when contributing.
- **We allow a maximum of 2 issues to be assigned per person.**
- The issues are assigned on *FIRST-COME-FIRST-SERVE* basis.
- Always use the issue and PR templates provided.

### Getting Started

1. **Fork the repository:** Start by forking the Lupo Skill repository to your own GitHub account.
2. **Clone the repository:** Clone the forked repository to your local machine using Git.

```bash
git clone https://github.com/your-username/lupo-skill.git
```

3. **Navigate to the project directory:**
```bash
cd lupo-skill
```
4. **Install dependencies:** Use npm to install the project dependencies.
```bash
npm install
```
5. **Set up Firebase:**
- Create a Firebase project on the Firebase console.
- Configure Firebase authentication, Firestore database(rtdb), and storage (remeber to edit the rules).
- Update Firebase configurations in the project. in **`firebaseConf.ts`**

6. **Run the website**
```bash
npm run start
```
7. **Make your changes:** Implement your changes or add new features to the codebase.
8. **Commit your changes:** Commit your changes with clear and descriptive messages.
```bash
git commit -m "Your commit message"
```
9. **Create a branch:** Create a new branch in your fork.
```bash
git branch <branch name>
```
10. **Switch to the created branch**
```bash
git checkout <branch name>
```
11. **Push your changes:** Push your changes to your forked repository.
```bash
git push origin <branch name>
```
12. **Create a pull request:** Submit a pull request to the Lupo Skill repository.


### Alternatively contribute using GitHub Desktop

1. **Open GitHub Desktop:**
   Launch GitHub Desktop and log in to your GitHub account if you haven't already.

2. **Clone the Repository:**
   - If you haven't cloned the lupo-skill repository yet, you can do so by clicking on the "File" menu and selecting "Clone Repository."
   - Choose the repository from the list of repositories on GitHub and clone it to your local machine.

3. **Switch to the Correct Branch:**
   - Ensure you are on the branch that you want to submit a pull request for.
   - If you need to switch branches, you can do so by clicking on the "Current Branch" dropdown menu and selecting the desired branch.

4. **Make Changes:**
   Make your changes to the code or files in the repository using your preferred code editor.

5. **Commit Changes:**
   - In GitHub Desktop, you'll see a list of the files you've changed. Check the box next to each file you want to include in the commit.
   - Enter a summary and description for your changes in the "Summary" and "Description" fields, respectively. Click the "Commit to <branch-name>" button to commit your changes to the local branch.

6. **Push Changes to GitHub:**
   After committing your changes, click the "Push origin" button in the top right corner of GitHub Desktop to push your changes to your forked repository on GitHub.

7. **Create a Pull Request:**
  - Go to the GitHub website and navigate to your fork of the lupo-skill repository.
  - You should see a button to "Compare & pull request" between your fork and the original repository. Click on it.

8. **Review and Submit:**
   - On the pull request page, review your changes and add any additional information, such as a title and description, that you want to include with your pull request.
   - Once you're satisfied, click the "Create pull request" button to submit your pull request.

9. **Wait for Review:**
    Your pull request will now be available for review by the project maintainers. They may provide feedback or ask for changes before merging your pull request into the main branch of the lupo-skill repository.
