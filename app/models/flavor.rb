class Flavor < ActiveRecord::Base
  attr_accessible :alias, :flavorid, :memory_mb, :name, :vcpus
end
