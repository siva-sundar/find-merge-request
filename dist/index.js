"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var nodeFetch = require('node-fetch');

var chalk = require('chalk');

var red = chalk.red;

function makeNetworkRequest() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var projectId = options.projectId,
      gitlabToken = options.gitlabToken,
      apiURL = options.apiURL;
  var url = "".concat(apiURL, "/projects/").concat(projectId, "/merge_requests");
  return nodeFetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': gitlabToken
    }
  });
}

function canInitiateNextRequest(_ref) {
  var relatedMR = _ref.relatedMR,
      mergeRequests = _ref.mergeRequests,
      _ref$params = _ref.params,
      params = _ref$params === void 0 ? {} : _ref$params;

  if (relatedMR || mergeRequests.length !== params.per_page) {
    return false;
  }

  return true;
}

function _findMergeRequest(_x, _x2) {
  return _findMergeRequest2.apply(this, arguments);
}

function _findMergeRequest2() {
  _findMergeRequest2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2, _ref3) {
    var branchName, projectId, gitlabToken, apiURL, _ref3$state, state, _ref3$page, page, _ref3$per_page, per_page, params, response, mergeRequests, relatedMR;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            branchName = _ref2.branchName, projectId = _ref2.projectId, gitlabToken = _ref2.gitlabToken, apiURL = _ref2.apiURL;
            _ref3$state = _ref3.state, state = _ref3$state === void 0 ? 'opened' : _ref3$state, _ref3$page = _ref3.page, page = _ref3$page === void 0 ? 1 : _ref3$page, _ref3$per_page = _ref3.per_page, per_page = _ref3$per_page === void 0 ? 100 : _ref3$per_page;
            params = {
              state: state,
              page: page,
              per_page: per_page
            };
            _context.prev = 3;
            _context.next = 6;
            return makeNetworkRequest({
              projectId: projectId,
              gitlabToken: gitlabToken,
              apiURL: apiURL
            });

          case 6:
            response = _context.sent;
            _context.next = 9;
            return response.json();

          case 9:
            mergeRequests = _context.sent;
            relatedMR = mergeRequests.find(function (row) {
              return row.source_branch === branchName;
            });

            if (!canInitiateNextRequest({
              relatedMR: relatedMR,
              mergeRequests: mergeRequests,
              params: params
            })) {
              _context.next = 16;
              break;
            }

            params.page++;
            _context.next = 15;
            return _findMergeRequest({
              branchName: branchName,
              projectId: projectId,
              gitlabToken: gitlabToken,
              apiURL: apiURL
            }, params);

          case 15:
            return _context.abrupt("return", _context.sent);

          case 16:
            return _context.abrupt("return", relatedMR || {});

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](3);
            console.log(red('Error while finding merge request'), _context.t0);
            throw _context.t0;

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 19]]);
  }));
  return _findMergeRequest2.apply(this, arguments);
}

function findMergeRequest() {
  return _findMergeRequest3.apply(this, arguments);
}

function _findMergeRequest3() {
  _findMergeRequest3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var options,
        state,
        projectId,
        gitlabToken,
        apiURL,
        branchName,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            state = options.state, projectId = options.projectId, gitlabToken = options.gitlabToken, apiURL = options.apiURL, branchName = options.branchName;

            if (!(!projectId || !gitlabToken || !apiURL || !branchName)) {
              _context2.next = 4;
              break;
            }

            throw new Error("Kindly pass projectId, gitlabToken, branchName and apiURL as a hash\n\n      For instance, findMergeRequest({ projectId: 1, gitlabToken: 'aer', apiURL: 'https://gitlab.com/api/v4', branchName: 'feature_contacts_form' });\n    ");

          case 4:
            _context2.next = 6;
            return _findMergeRequest(options, {
              state: state
            });

          case 6:
            return _context2.abrupt("return", _context2.sent);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _findMergeRequest3.apply(this, arguments);
}

module.exports = findMergeRequest;