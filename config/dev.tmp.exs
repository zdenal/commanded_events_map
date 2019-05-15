use Mix.Config

config :commanded_process_map, :project,
  path: "/Users/zdenko/Projects/elixir/conduit",
  path_wildcard: "/lib/**/*.ex"

config :commanded_process_map, :types,
  aggregate: %{
    regexp: ~r/Commands.+Events.+execute.+apply/s,
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
    named: ~r/Events.{(?<events>.*?)}/s,
    scan: ~r/Events\.\w*/s
  }
