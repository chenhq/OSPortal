class OsType < ActiveRecord::Base
  attr_accessible :desc, :family, :name
  has_many :operating_systems
end
