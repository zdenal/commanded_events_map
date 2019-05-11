# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

# This configuration is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project. For this reason,
# if you want to provide default values for your application for
# third-party users, it should be done in your "mix.exs" file.

# You can configure your application as:
#
config :commanded_process_map, :types,
  aggregate: ~r/Commands.+Events.+defstruct.+execute/s,
  processor: ~r/Commanded\.ProcessManagers\.ProcessManager/s,
  projector: ~r/Commanded\.Projections.+name.+project/s,
  handler: ~r/Events\.Handler.+name.+defhandle/s

config :commanded_process_map, :regexp,
  commands: %{
    named: ~r/Commands.{(?<commands>.*?)}/s,
    scan: ~r/Commands\.\w*/s
  },
  events: %{
    named: ~r/alias Events.{(?<events>.*?)}/s,
    scan: ~r/Events\.\w*/s
  }

config :commanded_process_map, json_file: "./node/data.json"

#     import_config "#{Mix.env()}.exs"
