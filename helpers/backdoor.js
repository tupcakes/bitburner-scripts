// https://www.reddit.com/r/Bitburner/comments/s76r79/script_to_connect_easily_to_any_server/
// This function produces a list of "gateway" servers for each server in serverNameList.
// If we were to take the shortest path from home to any given server, the "gateway" server would be the last hop before reaching our target.
// We only need to record the gateway server and not the rest of the path because the gateway server will then have its own entry in this list with its own gateway server,
// repeating until we can trace the path all the way back to home.
function generatePathList(ns, serverNameList) {

    // make a list of empty strings, the same length as serverNameList
    let serverPathList = serverNameList.map(function () {
        return "";
    });

    let visited = [];
    let queue = ["home"];

    while (queue.length > 0) {

        // pop the front of the queue off - this will be the node that serves as our source here.
        let node = queue.shift();
        visited.push(node);

        // navigate the list of the neighbouring servers.
        let neighbours = ns.scan(node);
        for (let server of neighbours) {

            // if we haven't already visted this server...
            if (!visited.includes(server)) {
                // set the path to the source node.
                serverPathList[serverNameList.indexOf(server)] = node;
                // add these neighbours to the queue.
                queue.push(server);
            }
        }
    }
    return serverPathList;
}

export async function main(ns) {

    // List of all the servers. There's a split at the end to make it an actual list, lol.
    let serverNameList = "n00dles,foodnstuff,sigma-cosmetics,joesguns,hong-fang-tea,harakiri-sushi,iron-gym,home,zer0,nectar-net,CSEC,max-hardware,neo-net,phantasy,silver-helix,omega-net,the-hub,netlink,johnson-ortho,crush-fitness,comptek,avmnite-02h,catalyst,I.I.I.I,summit-uni,rothman-uni,zb-institute,syscore,millenium-fitness,alpha-ent,lexo-corp,aevum-police,rho-construction,aerocorp,galactic-cyber,snap-fitness,global-pharm,unitalife,deltaone,omnia,defcomm,icarus,solaris,zeus-med,univ-energy,nova-med,infocomm,zb-def,taiyang-digital,microdyne,applied-energetics,titan-labs,run4theh111z,vitalife,stormtech,fulcrumtech,helios,4sigma,.,omnitek,kuai-gong,b-and-a,blade,powerhouse-fitness,nwo,clarkinc,fulcrumassets,ecorp,megacorp,The-Cave,w0r1d_d43m0n".split(',');
    // Generates a list of the previous "hop" on the path from home to the target for each server.
    let serverPathList = generatePathList(ns, serverNameList);
    // The target is provided as an arg.
    let target = ns.args[0];

    if (ns.serverExists(target)) {
        let path = [target];

        // create the list of hops from the target to home.
        while (path[path.length - 1] != "home") {
            let lasthop = path[path.length - 1];
            let nexthop = serverPathList[serverNameList.indexOf(lasthop)];
            path.push(nexthop);
        }
        path.pop();

        // invert the array, so the path is written from home to the target.
        path.reverse();

        //ns.tprint(path);

        for (const server of path) {
            ns.connect(server);
        }
        await ns.installBackdoor();
        ns.connect('home');


    } else {
        // print this if the target doesn't exist or if there's not arg provided.
        ns.tprintf("That target does not exist. Or maybe you forgot to include an argument.")
        if (ns.args.length > 0) {
            let possibleList = [];
            for (let server of serverNameList) {
                if (server.includes(target)) {
                    possibleList.push(server);
                }
            }
            if (possibleList.length > 0) {
                ns.tprintf("Maybe you were looking for one of these servers: " + possibleList.join(", "));
            }
        }
    }
}