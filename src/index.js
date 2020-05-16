const nodeFetch = require('node-fetch');
const chalk = require('chalk');
const { red } = chalk;

function makeNetworkRequest (options = {}) {

  const { projectId, gitlabToken, apiURL } = options;

  const url = `${apiURL}/projects/${projectId}/merge_requests`;

  return nodeFetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': gitlabToken
    }
  });
}

function canInitiateNextRequest ({ relatedMR, mergeRequests, params = {} }) {

  if (relatedMR || mergeRequests.length !== params.per_page) {
    return false;
  }
  return true;

}

async function _findMergeRequest ({ branchName, projectId, gitlabToken, apiURL }, { state = 'opened', page = 1, per_page = 100 }) {

  const params = { state, page, per_page };

  try {
    const response = await makeNetworkRequest({ projectId, gitlabToken, apiURL });
    const mergeRequests = await response.json();
    const relatedMR = mergeRequests.find((row) => row.source_branch === branchName);

    if (canInitiateNextRequest({ relatedMR, mergeRequests, params })) {
      params.page++;
      return await _findMergeRequest({ branchName, projectId, gitlabToken, apiURL }, params);
    }

    return relatedMR || {};
  } catch (exception) {
    console.log(red('Error while finding merge request'), exception);
    throw exception;
  }
}

async function findMergeRequest (options = {}) {
  const { state, projectId, gitlabToken, apiURL, branchName } = options;

  if (!projectId || !gitlabToken || !apiURL || !branchName) {
    throw new Error(`Kindly pass projectId, gitlabToken, branchName and apiURL as a hash

      For instance, findMergeRequest({ projectId: 1, gitlabToken: 'aer', apiURL: 'https://gitlab.com/api/v4', branchName: 'feature_contacts_form' });
    `);
  }
  return await _findMergeRequest(options, { state });
}

module.exports = findMergeRequest;
