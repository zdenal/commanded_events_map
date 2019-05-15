# Commanded Process Map

This tool is meant to help people which are working with elixir [Commanded](https://github.com/commanded/commanded) apps.
The solution isn't some silver bullet and is based on as simple (and silly) solution as was possible to quickly get some
satisfying result related to projects I am working with.

I was build this tool on project which is including now 65 nodes (aggregates, handlers, ...) and I hope this could help us get
better picture about whole system.

## Example
This example is generated for [https://github.com/slashdotdash/conduit](https://github.com/slashdotdash/conduit)
![Output sample](assets/example.gif)

## Installation
1. copy [config/dev.tmp.exs](config/dev.tmp.exs) as `config/dev.exs` and set properly path to your project. The `path_wildcard`
is used to get better files what we want to analyse.

2. execute `./bin/setup`. Setup **mix** and install required node packages for frontend client.
3. execute `./bin/generate_data`. This command will generate required json file for FE in `frontend_client` folder.
4. execute `./bin/run_client`. Will run server (serving generated json file to FE) and open FE react application in browser.

*!! Right now once you'll generate data again you need also restart client to let server return new generated data. This will be
fixed soon.*

## Configuration & Base Logic
**The main app logic is based on configuration and regular expressions.** In [config/dev.exs](config/dev.exs) you can play with it.

- `config :commanded_process_map, :project`
  - `path:` set path to your project
  - `path_wildcard:` set wildcard pattern to anaylyse only files which matters. (eg. `/lib/**/*.ex` or `/*/lib/**/*.ex` in umbrella apps)


- `config :commanded_process_map, :types` are representing **nodes** if FE flow graph. The `key` is type of node and following are
  - `regexp` regular expression to regognise node
  - `not_one_of` list of regular expressions to exclude file if some is evaluated as `true`
  - `output` what type of output is node emitting
  - `targets` what types of **nodes** are receiving output from this type of **node**

- `config :commanded_process_map, :regexp` are used for analysing each **node** what edges (**commands** and **events**) are they using. It is
including regexp for **named** capturing and parsing and for **scan** parsing.

**You can define as many nodes as want. They will be automatically grouped by colour in graph and edged by rules in config (output, targets). You can even create your own pseudo language for
spiking ideas and update config regexp by it. It will generate you graph for presenting that logic/structure.***

## TODO
- [ ] after regenerating data let server returning new data (no needs to restart)
- [ ] investigation/play with graph options to reach better UX
- [ ] think about graph options which could be play/set `vis` graph option for user on FE
- [ ] update README by UI possibilities description (selecting, source code view, ...)
- [ ] improve selectors (suggestion filter, ...)
