import { Command, bold, yellow, red, installUpdateHandler } from "../deps.ts";

const installPrefix = "__";

const desc = `${
  yellow(
    `A simple wrapper around the ${
      bold("deno install")
    } command for handling updates.`,
  )
}

Installs a script as an executable in the installation root's bin directory.
  eggs install --allow-net --allow-read https://deno.land/std/http/file_server.ts
  eggs install https://deno.land/std/examples/colors.ts

To change the executable name, use -n/--name:
  eggs install --allow-net --allow-read -n serve https://deno.land/std/http/file_server.ts

The executable name is inferred by default:
  - Attempt to take the file stem of the URL path. The above example would
    become 'file_server'.
  - If the file stem is something generic like 'main', 'mod', 'index' or 'cli',
    and the path has no parent, take the file name of the parent path. Otherwise
    settle with the generic name.

To change the installation root, use --root:
  eggs install --allow-net --allow-read --root /usr/local https://deno.land/std/http/file_server.ts

The installation root is determined, in order of precedence:
  - --root option
  - DENO_INSTALL_ROOT environment variable
  - $HOME/.deno

These must be added to the path manually if required.`;

export const install = new Command()
  .version("0.1.0")
  .description(desc)
  .option("-A, --allow-all", "Allow all permissions")
  .option("--allow-env", "Allow environment access")
  .option("--allow-hrtime", "Allow high resolution time measurement")
  .option("--allow-net=<allow-net>", "Allow network access")
  .option("--allow-plugin", "Allow loading plugins")
  .option("--allow-read=<allow-read>", "Allow file system read access")
  .option("--allow-run", "Allow running subprocesses")
  .option("--allow-write=<allow-write>", "Allow file system write access")
  .option(
    "--cert <FILE>",
    "Load certificate authority from PEM encoded file",
  )
  .option(
    "-f, --force",
    "Forcefully overwrite existing installation",
  )
  .option(
    "-L, --log-level <log-level> ",
    "Set log level [possible values: debug, info]",
  )
  .option("-n, --name <name>", "Executable file name")
  .option("-q, --quiet", "Suppress diagnostic output")
  .option("--root <root>", "Installation root")
  .option("--unstable", "Enable unstable APIs")
  .useRawArgs()
  .action(installModule);

async function installModule(_: any, ...args: string[]) {
  if (["-h", "--help", "help"].includes(args[0])) {
    Deno.stdout.writeSync(
      new TextEncoder().encode(install.getHelpCommand().getHelp()),
    );
    Deno.exit();
  }

  const indexOfURL = args.findIndex((arg) => arg.match(/http/));
  const indexOfName = args.indexOf("-n");

  if (indexOfURL < 0) {
    console.error(red("You need to pass in a module URL!"));
    Deno.exit(1);
  }

  const url = args[indexOfURL];
  let name: string;

  if (indexOfName < 0) {
    const tmpSplit = url.split("@"); // Expected: ["import ... https://...[std|<module>]", "<version>/..."]
    if (tmpSplit.length !== 2) { // eg not versioned
      console.log("Not versioned");
    }
    name = tmpSplit[0].split("/").pop() || "";
    args.splice(indexOfURL, 0, installPrefix + name);
    args.splice(indexOfURL, 0, "-n");
  } else {
    name = args[indexOfName + 1];
    args[indexOfName + 1] = installPrefix + name;
  }

  console.log(name);

  const installation = Deno.run({
    cmd: [
      "deno",
      "install",
      ...args,
    ],
  });

  const status = await installation.status();
  installation.close();

  installUpdateHandler(name, installPrefix + name, url)
}
