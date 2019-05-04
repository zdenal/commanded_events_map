defmodule CommandedProcessMapTest do
  use ExUnit.Case
  doctest CommandedProcessMap

  test "greets the world" do
    assert CommandedProcessMap.hello() == :world
  end
end
