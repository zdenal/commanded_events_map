# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

# This configuration is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project. For this reason,
# if you want to provide default values for your application for
# third-party users, it should be done in your "mix.exs" file.

# You can configure your application as:
config :commanded_process_map, :project,
  path: "/Users/zdenko/Projects/utrust/platform/apps",
  path_wildcard: "/*/lib/**/*.ex"

config :commanded_process_map, :types,
  aggregate: %{
    regexp: ~r/Commands.+Events.+defstruct.+execute/s,
    not_one_of: [],
    output: "events",
    targets: ["processor", "projector", "handler"]
  },
  processor: %{
    regexp: ~r/Commanded\.ProcessManagers\.ProcessManager/s,
    not_one_of: [],
    output: "commands",
    targets: ["aggregate"]
  },
  projector: %{
    regexp: ~r/Commanded\.Projections.+name.+project/s,
    not_one_of: [],
    output: nil,
    targets: nil
  },
  handler: %{
    regexp: ~r/(Events\.Handler.+name.+defhandle|Handler.+def handle)/s,
    not_one_of: [],
    output: "commands",
    targets: ["aggregate"]
  },
  commandsApi: %{
    regexp: ~r/defmodule.+Commands.*/s,
    not_one_of: [
      ~r/(validates :|defstruct|defhandle|Commanded\.Commands\.Router|Commanded\.Commands\.CompositeRouter)/s,
      ~r/Commands.+Events.+defstruct.+execute/s,
      ~r/Commanded\.ProcessManagers\.ProcessManager/s,
      ~r/Commanded\.Projections.+name.+project/s,
      ~r/(Events\.Handler.+name.+defhandle|Handler.+def handle)/s
    ],
    output: "commands",
    targets: ["aggregate"]
  }

config :commanded_process_map, :regexp,
  commands: %{
    named: ~r/Commands.{(?<commands>.*?)}/s,
    scan: ~r/Commands\.\w*/s
  },
  events: %{
    named: ~r/alias Events.{(?<events>.*?)}/s,
    scan: ~r/Events\.\w*/s
  }

config :commanded_process_map, json_file: "./frontend_client/data.json"

#     import_config "#{Mix.env()}.exs"
