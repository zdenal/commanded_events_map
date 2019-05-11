defmodule CommandedProcessMap do
  @directory "/Users/zdenko/Projects/utrust/platform/apps"
  @path_wildcard "/*/lib/**/*.ex"

  def run do
    files =
      Path.wildcard(@directory <> @path_wildcard)
      |> Enum.map(&read/1)

    config(:types)
    |> Enum.map(&handle_types(&1, files))
    |> List.flatten()
    |> transform_to_json()
    |> create_json_file()
  end

  defp handle_types({type, regex}, files) do
    files
    |> Enum.filter(&check_type(&1, regex))
    |> Enum.map(&Map.merge(&1, %{type: type}))
    |> Enum.map(&analyse/1)
  end

  defp transform_to_json(data) do
    %{
      nodes: data
    }
  end

  defp create_json_file(json) do
    File.write!(config(:json_file), Poison.encode!(json), [:binary])
  end

  defp read(file) do
    {:ok, device} = File.open(file, [:read])
    content = IO.read(device, :all)
    name = String.replace(file, @directory, "")

    %{file: file, content: content, name: name}
  end

  defp analyse(aggregate) do
    aggregate |> analyse_commands() |> analyse_events()
  end

  def analyse_commands(subject) do
    commands =
      with %{"commands" => parsed_commands} <-
             Regex.named_captures(config(:regexp)[:commands].named, subject.content) do
        String.split(parsed_commands, ",")
        |> Enum.map(&String.trim/1)
      else
        nil -> []
      end
      |> Enum.concat(Regex.scan(config(:regexp)[:commands].scan, subject.content))
      |> List.flatten()
      |> remove_empty()

    subject |> Map.merge(%{commands: commands})
  end

  def analyse_events(subject) do
    events =
      with %{"events" => parsed_events} <-
             Regex.named_captures(config(:regexp)[:events].named, subject.content) do
        String.split(parsed_events, ",")
        |> Enum.map(&String.trim/1)
      else
        nil -> []
      end
      |> Enum.concat(Regex.scan(config(:regexp)[:events].scan, subject.content))
      |> List.flatten()
      |> remove_empty()

    subject |> Map.merge(%{events: events})
  end

  defp check_type(%{content: content}, regexp), do: Regex.match?(regexp, content)

  defp remove_empty(list),
    do:
      list
      |> Enum.map(&Regex.replace(~r/(Events\.|Events\.Handler|Handler|Commands\.)/, &1, ""))
      |> Enum.filter(&(String.length(&1) > 0))

  def config(key), do: Application.get_env(:commanded_process_map, key)
end
