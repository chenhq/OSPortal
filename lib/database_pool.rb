require 'active_record'

class Portal < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "osportal",
                       :username => "root",
                       :password => "iheartdatabisses",
                       :host => "60.55.40.211",
                       :port => 3306)
end

class Nova < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "nova",
                       :username => "root",
                       :password => "iheartdatabisses",
                       :host => "60.55.40.211",
                       :port => 3306)

end

class Glance < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "glance",
                       :username => "root",
                       :password => "iheartdatabisses",
                       :host => "60.55.40.211",
                       :port => 3306)

end

class Cinder < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "cinder",
                       :username => "root",
                       :password => "iheartdatabisses",
                       :host => "60.55.40.211",
                       :port => 3306)

end

class Keystone < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "keystone",
                       :username => "root",
                       :password => "iheartdatabisses",
                       :host => "60.55.40.211",
                       :port => 3306)

end




# class Portal < ActiveRecord::Base
#   establish_connection "portal_development"
#   self.abstract_class = true
# end


# class Glance < ActiveRecord::Base
#   establish_connection "glance_development"
#   self.abstract_class = true
# end

# class Cinder < ActiveRecord::Base
#   establish_connection "cinder_development"
#   self.abstract_class = true
# end

# class Keystone < ActiveRecord::Base
#   establish_connection "keystone_development"
#   self.abstract_class = true
# end

# class Nova < ActiveRecord::Base
#   establish_connection "nova_development"
#   self.abstract_class = true
# end
