defmodule Mix.Tasks.ScanAndGenerate do
  use Mix.Task
  @shortdoc "Scan give project path and generate data"
  @moduledoc ~S"""
  This will generate required json data structure for
  display events/commands flow in your app

  #Usage
  ```
     mix scan_and_generate
  ```
  """
  def run(_) do
    CommandedProcessMap.run()
  end
end
