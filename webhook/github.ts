import http, { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';
import 'dotenv/config';

const port = process.env.WEBHOOK_GITHUB_PORT || 8080;
const SECRET = process.env.WEBHOOK_GITHUB_SECRET;
const repo = process.env.REPOSITOEY_PATH;




http.createServer((req: IncomingMessage, res: ServerResponse) => {


    if (req.method == 'POST') {
        console.log('POST')
        var body = ''
        req.on('data', (data) => {
            body += data
        })
        req.on('end', () => {
            console.log('Body: ' + body)
            console.log("request headers", req.headers);

            const jsonBody = JSON.parse(body);
            let sig = "sha1=" + crypto.createHmac('sha1', SECRET).update(body.toString()).digest('hex');

            console.log(`${req.headers['x-hub-signature']}:${sig}`);

            if (req.headers['x-hub-signature'] == sig) {
                exec('cd ' + repo + ' && git pull');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('OK')
        })
    } else {
        console.log(req);
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('OK.')
    }


    res.end();
}).listen(port);
console.log(`Server started on port ${port}`)


/*
{
    "ref": "refs/heads/work/1.0.0/main",
    "before": "06efe8db2da11f29bd9501eced09a88c7c2d5430",
    "after": "e2f0922821e5be1f2932bd199da056feca0a9780",
    "repository": {
        "id": 490654777,
        "node_id": "R_kgDOHT7MOQ",
        "name": "spika3Documentation",
        "full_name": "cloverstudio/spika3Documentation",
        "private": false,
        "owner": {
            "name": "cloverstudio",
            "email": "services@clover.studio",
            "login": "cloverstudio",
            "id": 1647800,
            "node_id": "MDQ6VXNlcjE2NDc4MDA=",
            "avatar_url": "https://avatars.githubusercontent.com/u/1647800?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/cloverstudio",
            "html_url": "https://github.com/cloverstudio",
            "followers_url": "https://api.github.com/users/cloverstudio/followers",
            "following_url": "https://api.github.com/users/cloverstudio/following{/other_user}",
            "gists_url": "https://api.github.com/users/cloverstudio/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/cloverstudio/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/cloverstudio/subscriptions",
            "organizations_url": "https://api.github.com/users/cloverstudio/orgs",
            "repos_url": "https://api.github.com/users/cloverstudio/repos",
            "events_url": "https://api.github.com/users/cloverstudio/events{/privacy}",
            "received_events_url": "https://api.github.com/users/cloverstudio/received_events",
            "type": "User",
            "site_admin": false
        },
        "html_url": "https://github.com/cloverstudio/spika3Documentation",
        "description": "Spika3Documentation",
        "fork": true,
        "url": "https://github.com/cloverstudio/spika3Documentation",
        "forks_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/forks",
        "keys_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/teams",
        "hooks_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/hooks",
        "issue_events_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/issues/events{/number}",
        "events_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/events",
        "assignees_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/assignees{/user}",
        "branches_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/branches{/branch}",
        "tags_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/tags",
        "blobs_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/languages",
        "stargazers_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/stargazers",
        "contributors_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/contributors",
        "subscribers_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/subscribers",
        "subscription_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/subscription",
        "commits_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/contents/{+path}",
        "compare_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/merges",
        "archive_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/downloads",
        "issues_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/issues{/number}",
        "pulls_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/labels{/name}",
        "releases_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/releases{/id}",
        "deployments_url": "https://api.github.com/repos/cloverstudio/spika3Documentation/deployments",
        "created_at": 1652179776,
        "updated_at": "2022-05-11T07:49:04Z",
        "pushed_at": 1652256580,
        "git_url": "git://github.com/cloverstudio/spika3Documentation.git",
        "ssh_url": "git@github.com:cloverstudio/spika3Documentation.git",
        "clone_url": "https://github.com/cloverstudio/spika3Documentation.git",
        "svn_url": "https://github.com/cloverstudio/spika3Documentation",
        "homepage": null,
        "size": 3145,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CSS",
        "has_issues": false,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": false,
        "forks_count": 0,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 0,
        "license": null,
        "allow_forking": true,
        "is_template": false,
        "topics": [],
        "visibility": "public",
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "work/1.0.0/main",
        "stargazers": 0,
        "master_branch": "work/1.0.0/main"
    },
    "pusher": {
        "name": "kenyasue",
        "email": "ken@clover.studio"
    },
    "sender": {
        "login": "kenyasue",
        "id": 1062486,
        "node_id": "MDQ6VXNlcjEwNjI0ODY=",
        "avatar_url": "https://avatars.githubusercontent.com/u/1062486?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/kenyasue",
        "html_url": "https://github.com/kenyasue",
        "followers_url": "https://api.github.com/users/kenyasue/followers",
        "following_url": "https://api.github.com/users/kenyasue/following{/other_user}",
        "gists_url": "https://api.github.com/users/kenyasue/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/kenyasue/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/kenyasue/subscriptions",
        "organizations_url": "https://api.github.com/users/kenyasue/orgs",
        "repos_url": "https://api.github.com/users/kenyasue/repos",
        "events_url": "https://api.github.com/users/kenyasue/events{/privacy}",
        "received_events_url": "https://api.github.com/users/kenyasue/received_events",
        "type": "User",
        "site_admin": false
    },
    "created": false,
    "deleted": false,
    "forced": false,
    "base_ref": null,
    "compare": "https://github.com/cloverstudio/spika3Documentation/compare/06efe8db2da1...e2f0922821e5",
    "commits": [{
        "id": "e2f0922821e5be1f2932bd199da056feca0a9780",
        "tree_id": "8bb89801eb6d646c5ae4a1b689ee7cf2679f34fa",
        "distinct": true,
        "message": "test",
        "timestamp": "2022-05-11T10:09:37+02:00",
        "url": "https://github.com/cloverstudio/spika3Documentation/commit/e2f0922821e5be1f2932bd199da056feca0a9780",
        "author": {
            "name": "Ken",
            "email": "ken@clover.studio",
            "username": "kenyasue"
        },
        "committer": {
            "name": "Ken",
            "email": "ken@clover.studio",
            "username": "kenyasue"
        },
        "added": [],
        "removed": [],
        "modified": ["pages/00.index.md"]
    }],
    "head_commit": {
        "id": "e2f0922821e5be1f2932bd199da056feca0a9780",
        "tree_id": "8bb89801eb6d646c5ae4a1b689ee7cf2679f34fa",
        "distinct": true,
        "message": "test",
        "timestamp": "2022-05-11T10:09:37+02:00",
        "url": "https://github.com/cloverstudio/spika3Documentation/commit/e2f0922821e5be1f2932bd199da056feca0a9780",
        "author": {
            "name": "Ken",
            "email": "ken@clover.studio",
            "username": "kenyasue"
        },
        "committer": {
            "name": "Ken",
            "email": "ken@clover.studio",
            "username": "kenyasue"
        },
        "added": [],
        "removed": [],
        "modified": ["pages/00.index.md"]
    }
*/