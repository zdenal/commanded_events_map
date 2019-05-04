defmodule CommandedProcessMap do
  @directory "/Users/zdenko/Projects/utrust/platform/apps"
  @aggregate_regexp ~r/Commands.+Events.+defstruct.+execute/s
  @handler_regexp ~r/Events\.Handler.+name.+defhandle/s
  @commands_regexp ~r/(Commands.{(?<commands>.*?)}|Commands.(?<command>.*?)\s)/s
  @events_regexp ~r/(alias Events.{(?<events>.*?)}|alias Events.(?<event>.*?)\s)/s
  @json_file "./node/data.json"

  def run do
    files =
      get_files()
      |> Enum.map(&read/1)

    handlers = analyse_handlers(files)
    aggregates = analyse_aggregates(files)

    Enum.concat(handlers, aggregates)
    |> transform_to_json()
    |> create_json_file()
  end

  defp transform_to_json(data) do
    %{
      nodes: data,
      edges: []
    }
  end

  defp create_json_file(json) do
    File.write!(@json_file, Poison.encode!(json), [:binary])
  end

  defp get_node(data) do
    %{id: data.name, label: data.label, type: data.type}
  end

  defp get_files do
    Path.wildcard(@directory <> "/*/lib/**/*.ex")
    |> Enum.filter(&filter_file/1)
  end

  defp read(file) do
    {:ok, device} = File.open(file, [:read])
    # |> String.replace(~r/\r|\n/, "")
    content = IO.read(device, :all)
    name = String.replace(file, @directory, "")
    label = String.split(name, "/") |> Enum.slice(-3, 100) |> Enum.join(" / ")

    %{file: file, content: content, name: name, label: label}
  end

  defp analyse_aggregates(files) do
    files
    |> Enum.filter(&is_aggregate?/1)
    |> Enum.map(&Map.merge(&1, %{type: "aggregate"}))
    |> Enum.map(&analyse/1)
  end

  defp analyse_handlers(files) do
    files
    |> Enum.filter(&is_handler?/1)
    |> Enum.map(&Map.merge(&1, %{type: "handler"}))
    |> Enum.map(&analyse/1)
  end

  defp analyse(aggregate) do
    aggregate |> analyse_commands() |> analyse_events()
  end

  def analyse_commands(subject) do
    commands =
      with %{"commands" => parsed_commands, "command" => command} <-
             Regex.named_captures(@commands_regexp, subject.content) do
        String.split(parsed_commands, ",")
        |> Enum.map(&String.trim/1)
        |> Enum.concat([command])
        |> remove_empty()
      else
        nil -> []
      end

    subject |> Map.merge(%{commands: commands})
  end

  def analyse_events(subject) do
    events =
      with %{"events" => parsed_events, "event" => event} <-
             Regex.named_captures(@events_regexp, subject.content) do
        String.split(parsed_events, ",")
        |> Enum.map(&String.trim/1)
        |> Enum.concat([event])
        |> remove_empty()
      else
        nil -> []
      end

    subject |> Map.merge(%{events: events})
  end

  defp is_aggregate?(%{content: content}), do: Regex.match?(@aggregate_regexp, content)
  defp is_handler?(%{content: content}), do: Regex.match?(@handler_regexp, content)

  defp remove_empty(list), do: Enum.filter(list, &(String.length(&1) > 0))

  defp filter_file(file),
    do:
      file
      |> String.match?(~r/(.*_web\/)/)
      |> Kernel.not()
end
