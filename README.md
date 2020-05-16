# find-merge-request
A npm package to find the merge request using the branch name in a gitlab project.

## Installation
```bash
  npm install find-merge-request or yarn add find-merge-request
```

## Usage

```javascript

const findMergeRequest = require('find-merge-request');

async function mergeRequestDetails() {
  let mergeRequest = await findMergeRequest({   /* this will return the details of the merge request if found
  else it will return an empty object. */
    apiURL: 'https://git.csez.zohocorpin.com/api/v4',
    gitlabToken: '*********',
    projectId: '123',
    branchName: "feature_contact_details"
  }); 
}
```
